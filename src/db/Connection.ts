import ArangoJS from 'arangojs';
import AccessQuery from './query/Access';

export class Connection {
  private _db: ArangoJS.Database;
  private _query: AccessQuery;

  public constructor() {
    this._db = new ArangoJS.Database(process.env.ACTIVITYLOGGER_ARANGODB || 'http+tcp://127.0.0.1:8529');
    this._query = new AccessQuery(this._db);
  }

  public async setAccess(timelineId: string, mode: string, time: number, publicKey: string) {
    const col = this._db.collection(`access`);
    const existing = await this._query.queryAccessWithPublicKey(timelineId, publicKey);
    if (existing) {
      await col.update(existing._key, { timelineId, mode, time });
    } else {
      await col.save({ timelineId, mode, time, publicKey });
    }
  }

  public async queryAccess(timelineId: string) {
    return await this._query.queryAccess(timelineId);
  }

  public async queryAccessPublicKeys(timelineId: string) {
    return (await this._query.queryAccess(timelineId)).map((x) => x.publicKey);
  }

  public async canRead(timelineId: string, publicKey: string) {
    const mode = await this._query.queryAccessPublicKeyMode(timelineId, publicKey);
    return mode === 'READONLY' || mode === 'READWRITE';
  }

  public async canWrite(timelineId: string, publicKey: string) {
    const mode = await this._query.queryAccessPublicKeyMode(timelineId, publicKey);
    return mode === 'WRITEONLY' || mode === 'READWRITE';
  }

  public async addInteraction(timelineId: string, sourceId: string, timeStart: number, timeEnd: number, keypresses: number, mousepresses: number) {
    const col = this._db.collection(`interaction`);
    await col.save({ timelineId, sourceId, timeStart, timeEnd, keypresses, mousepresses });
  }

  public async addWindow(timelineId: string, sourceId: string, timeStart: number, timeEnd: number, titles: string[]) {
    const col = this._db.collection(`window`);
    await col.save({ timelineId, sourceId, timeStart, timeEnd, titles });
  }

  public async addFolder(timelineId: string, sourceId: string, timeStart: number, timeEnd: number, paths: string[]) {
    const col = this._db.collection(`folder`);
    await col.save({ timelineId, sourceId, timeStart, timeEnd, paths });
  }
}
export default new Connection();
