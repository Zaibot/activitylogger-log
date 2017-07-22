import express from 'express';
import { ServerRequest, ServerResponse } from 'http';

import { Connection } from '../db';
import trace from '../trace';
import validateTimeline from '../validate/timeline';
import Authorize from './Authorize';

// tslint:disable no-magic-numbers

const regexBase64FromBearer = /^Bearer ([-A-Za-z0-9+/=]+|=[^=]|={3,})$/;
const getBase64FromBearer = <T>(input: T) => {
  if (typeof input !== 'string') { return; }
  const match = regexBase64FromBearer.exec(input);
  if (!match) { return; }
  return match[1];
};

export default ({ requireTimelineId }: { requireTimelineId: boolean }) => async (req: InternalServerRequest, res: InternalServerResponse, next: (err?: any) => void) => {
  if (!req.body || !req.params) {
    return res.status(400).send('empty request');
  }
  const data = req.body.data;
  const publicKey = req.body.publicKey;
  const signature = req.body.signature;
  const timelineId = req.params.timeline;
  if (requireTimelineId && !validateTimeline(timelineId)) {
    return res.status(400).send('invalid timelineId');
  }
  if (!data || !publicKey || !signature) {
    return res.status(400).send('malformed request');
  }
  const buffer = new Buffer(data, 'base64');
  try {
    const canRead = timelineId ? await Authorize.canRead(Connection, timelineId, buffer, publicKey, signature) : false;
    const canWrite = timelineId ? await Authorize.canWrite(Connection, timelineId, buffer, publicKey, signature) : false;
    const hasRoot = await Authorize.isRootSignature(buffer, signature);
    req.auth = { timelineId, canRead, canWrite, hasRoot, buffer };
  } catch (ex) {
    // tslint:disable-next-line:no-console
    console.error(`[AUTH]`, ex);
    res.status(500);
    res.send('authorization failed on the server');
    return;
  }
  next();
};
