import express from 'express';

import trace from '../trace';

// tslint:disable no-magic-numbers

export default {
  query(req: InternalServerRequest, res: InternalServerResponse): any {
    trace.info(`[QUERY] meeting`);
    res.status(501);
    res.send('not implemented yet');
  },
  post(req: InternalServerRequest, res: InternalServerResponse): any {
    trace.info(`[POST] meeting`);
    res.status(501);
    res.send('not implemented yet');
  },
};
