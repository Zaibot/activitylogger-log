import express from 'express';
import { ServerRequest, ServerResponse } from 'http';
import uuid from 'uuid';

import { activitylogger } from '../../protocol/dist/recording';
import Authorize from '../auth/Authorize';
import { Connection } from '../db';
import trace from '../trace';
import validateTimeline from '../validate/timeline';

// tslint:disable no-magic-numbers

const modeToString = (m: activitylogger.Access.Type) => {
  switch (m) {
    case activitylogger.Access.Type.REVOKE: return `REVOKE`;
    case activitylogger.Access.Type.READONLY: return `READONLY`;
    case activitylogger.Access.Type.WRITEONLY: return `WRITEONLY`;
    case activitylogger.Access.Type.READWRITE: return `READWRITE`;
    default: throw Error(`Unknown access enum: ${m}`);
  }
};

export default {
  async query(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[QUERY] access`);
    res.status(501);
    res.send('not implemented yet');
  },
  async post(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[POST] access`);
    const { canWrite, timelineId, buffer } = req.auth;
    if (!canWrite) { return res.status(403).send('unauthorized'); }
    const access = activitylogger.Access.decode(buffer);
    if (access.timelineId !== timelineId) { return res.status(400).send('timelineId does not match'); }
    const time = Date.now();
    const mode = access.state;
    await Connection.setAccess(timelineId, modeToString(mode), time, access.publicKey);
    res.status(200).end();
  },
};
