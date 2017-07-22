import express from 'express';
import { ServerRequest, ServerResponse } from 'http';

import { activitylogger } from '../../protocol/dist/recording';
import Authorize from '../auth/Authorize';
import { Connection } from '../db';
import trace from '../trace';
import validateTimeline from '../validate/timeline';

// tslint:disable no-magic-numbers

export default {
  async query(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[QUERY] folder`);
    res.status(501);
    res.send('not implemented yet');
  },
  async post(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[POST] folder`);
    const { canWrite, timelineId, buffer } = req.auth;
    if (!canWrite) { return res.status(403).send('unauthorized'); }
    const folder = activitylogger.FolderActivity.decode(buffer);
    if (folder.timelineId !== timelineId) { return res.status(400).send('timelineId does not match'); }
    const time = Date.now();
    const { sourceId, timeStart, timeEnd, paths } = folder;
    await Connection.addFolder(timelineId, sourceId, asNumber(timeStart), asNumber(timeEnd), paths);
    res.status(200);
    res.end();
  },
};

import Long from 'long';
const asNumber = (n: number | Long) => {
  if (n instanceof Long) { return n.toNumber(); }
  return n;
};
