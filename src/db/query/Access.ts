import { Cursor, Database } from 'arangojs';
import { IAccess } from '../../data';
import { aqlQuery, AqlQuery } from './AqlQuery';

export default class {
  private _aqlQuery: AqlQuery;

  public constructor(private _database: Database) {
    this._aqlQuery = aqlQuery(_database);
  }

  public async queryAccess(timelineId: string): Promise<IAccess[]> {
    const query = await this._aqlQuery`FOR doc IN access FILTER doc.timelineId == ${timelineId} RETURN doc`;
    const result = await query.all();
    return result;
  }

  public async queryAccessPublicKeyMode(timelineId: string, publicKey: string): Promise<string> {
    const query = await this._aqlQuery`FOR doc IN access FILTER doc.timelineId == ${timelineId} AND doc.publicKey == ${publicKey} RETURN doc.mode`;
    const result = await query.next();
    return result;
  }

  public async queryHasPublicKey(publicKey: string): Promise<boolean> {
    const query = await this._aqlQuery`FOR doc IN access FILTER doc.publicKey == ${publicKey} RETURN doc._key`;
    const result = await query.next();
    return !!result;
  }

  public async queryAccessWithPublicKey(timelineId: string, publicKey: string): Promise<IAccess & { _key: any }> {
    const query = await this._aqlQuery`FOR doc IN access FILTER doc.timelineId == ${timelineId} AND doc.publicKey == ${publicKey} RETURN doc`;
    const result = await query.next();
    return result;
  }
}
