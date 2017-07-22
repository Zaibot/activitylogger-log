// /api/v1/log/access
// /api/v1/log/create
// /api/v1/log/interaction
// /api/v1/log/folderactivity
// /api/v1/log/meeting

// tslint:disable

import Express from 'express';
import BodyParser from 'body-parser';
import Compression from 'compression';
import fs from 'fs';

import PackageJson from '../package.json';
import { AuthorizeMiddleware } from './auth';
import Signing from './signing';
import access from './log/access';
import create from './log/create';
import interaction from './log/interaction';
import folderactivity from './log/folderactivity';
import windowactivity from './log/windowactivity';
import meeting from './log/meeting';

const port = 8080;
const app = Express();

app.use(Compression());
app.use(BodyParser.urlencoded({ limit: 32 * 1024, extended: true }));
app.use(BodyParser.json({ limit: 32 * 1024 }));
app.post(`/api/v1/log/create`, AuthorizeMiddleware({ requireTimelineId: false }), create.post);
app.get(`/api/v1/log/access/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), access.query);
app.post(`/api/v1/log/access/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), access.post);
app.get(`/api/v1/log/interaction/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), interaction.query);
app.post(`/api/v1/log/interaction/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), interaction.post);
app.get(`/api/v1/log/folder/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), folderactivity.query);
app.post(`/api/v1/log/folder/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), folderactivity.post);
app.get(`/api/v1/log/window/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), windowactivity.query);
app.post(`/api/v1/log/window/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), windowactivity.post);
app.get(`/api/v1/log/meeting/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), meeting.query);
app.post(`/api/v1/log/meeting/:timeline`, AuthorizeMiddleware({ requireTimelineId: true }), meeting.post);
app.get(`/`, (req, res) => { res.end(`Activity Logger Log ${PackageJson.version}\n\nhttps://github.com/Zaibot/activitylogger-log\n`) });
app.get(`/api/v1/autoconfig`, (req, res) => res.end(`{ "address": { "dashboard": "http://localhost:8080", "log": "http://localhost:8080" } }`))
app.listen(port, () => { console.log(`Activity Logger Log ${PackageJson.version} listening on ${port}`); });
