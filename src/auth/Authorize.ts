import fs from 'fs';

import Config from '../config';
import { Connection } from '../db/Connection';
import Signing from '../signing';

const rootPublicKey = fs.readFileSync(Config.rootPublicKeyPath()).toString();

class Authorize {
  public async authorized(buffer: Buffer, publicKeys: string[], signature: string) {
    for (const publicKey of publicKeys) {
      if (Signing.verify(buffer, publicKey, signature)) {
        return publicKey;
      }
    }
    return null;
  }

  public async canRead(connection: Connection, timelineId: string, buffer: Buffer, publicKey: string, signature: string) {
    const valid = Signing.verify(buffer, publicKey, signature);
    if (!valid) { return false; }
    return connection.canRead(timelineId, publicKey);
  }

  public async canWrite(connection: Connection, timelineId: string, buffer: Buffer, publicKey: string, signature: string) {
    const valid = Signing.verify(buffer, publicKey, signature);
    if (!valid) { return false; }
    return connection.canWrite(timelineId, publicKey);
  }

  public async isRootSignature(buffer: Buffer, signature: string) {
    const publicKey = rootPublicKey;
    const valid = Signing.verify(buffer, publicKey, signature);
    return valid;
  }
}
export default new Authorize();
