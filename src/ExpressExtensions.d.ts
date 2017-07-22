import { Request, Response } from 'express';
import { ServerRequest, ServerResponse } from 'http';

// tslint:disable

declare global {
  export type InternalBody = { data: any; signature: string; };
  export type InternalServerRequest = (ServerRequest & Request) & { body: InternalBody; auth: { timelineId: string; canRead: boolean; canWrite: boolean; hasRoot: boolean; buffer: Buffer; }; };
  export type InternalServerResponse = (ServerResponse & Response);
}
