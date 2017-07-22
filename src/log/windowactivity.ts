import express from 'express';

import { activitylogger } from '../../protocol/dist/recording';
import Authorize from '../auth/Authorize';
import { Connection } from '../db';
import trace from '../trace';
import validateTimeline from '../validate/timeline';

// tslint:disable no-magic-numbers

export default {
  async query(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[QUERY] window`);
    res.status(501);
    res.send('not implemented yet');
  },
  async post(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[POST] window`);
    const { canWrite, timelineId, buffer } = req.auth;
    if (!canWrite) { return res.status(403).send('unauthorized'); }
    const window = activitylogger.WindowActivity.decode(buffer);
    if (window.timelineId !== timelineId) { return res.status(400).send('timelineId does not match'); }
    const time = Date.now();
    const { sourceId, timeStart, timeEnd, titles } = window;
    await Connection.addWindow(timelineId, sourceId, asNumber(timeStart), asNumber(timeEnd), titles);
    res.status(200);
    res.end();
  },
};

import Long from 'long';
const asNumber = (n: number | Long) => {
  if (n instanceof Long) { return n.toNumber(); }
  return n;
};
