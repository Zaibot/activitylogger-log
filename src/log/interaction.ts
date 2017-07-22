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
    trace.info(`[QUERY] interaction`);
    res.status(501);
    res.send('not implemented yet');
  },
  async post(req: InternalServerRequest, res: InternalServerResponse) {
    trace.info(`[POST] interaction`);
    const { canWrite, timelineId, buffer } = req.auth;
    if (!canWrite) { return res.status(403).send('unauthorized'); }
    const interaction = activitylogger.Interaction.decode(buffer);
    if (interaction.timelineId !== timelineId) { return res.status(400).send('timelineId does not match'); }
    const time = Date.now();
    const { sourceId, timeStart, timeEnd, keypresses, mousepresses } = interaction;
    await Connection.addInteraction(timelineId, sourceId, asNumber(timeStart), asNumber(timeEnd), keypresses, mousepresses);
    res.status(200);
    res.end();
  },
};

import Long from 'long';
const asNumber = (n: number | Long) => {
  if (n instanceof Long) { return n.toNumber(); }
  return n;
};
