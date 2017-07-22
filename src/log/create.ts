import express from 'express';
import { ServerRequest, ServerResponse } from 'http';
import NodeRsa from 'node-rsa';

import { activitylogger } from '../../protocol/dist/recording';
import Authorize from '../auth/Authorize';
import { Connection } from '../db';
import trace from '../trace';
import validateTimeline from '../validate/timeline';

// tslint:disable no-magic-numbers

const verifyPemPublicKey = (publicKey: string) => {
  try {
    const key = new NodeRsa(publicKey, 'pkcs8-public-pem');
    if (key.isEmpty()) { return false; }
    if (!key.isPublic(true)) { return false; }
    return true;
  } catch (ex) {
    // tslint:disable-next-line:no-console
    console.error(`[RSA] verify public key`, ex);
    return false;
  }
};

export default {
  async query(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[QUERY] create`);
    res.status(501);
    res.send('not implemented yet');
  },
  async post(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[POST] create`);
    const { canWrite, hasRoot, timelineId, buffer } = req.auth;
    if (!canWrite && !hasRoot) { return res.status(403).send('unauthorized'); }
    const create = activitylogger.TimelineCreate.decode(buffer);
    const createTimelineId = create.timelineId;
    const createPublicKey = create.publicKey;
    if (!validateTimeline(createTimelineId)) { return res.status(400).send('requested timelineId invalid'); }
    const exists = await Connection.queryAccess(createTimelineId);
    if (exists.length) { return res.status(201).send('timelineId already exists'); }
    const createTime = Date.now();
    const createMode = 'READWRITE';
    await Connection.setAccess(createTimelineId, createMode, createTime, createPublicKey);
    res.status(200).end();
  },
};
