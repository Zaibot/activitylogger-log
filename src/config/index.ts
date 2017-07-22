import path from 'path';

class Config {
  public readonly www = path.join(__dirname, `../dist`);

  public configFile(relative: string) {
    return path.join(this.www, `../config`, relative);
  }

  public rootPublicKeyPath() {
    return (process.env.ACTIVITYLOGGER_ROOTSIGNATURE as string) || this.configFile(`root-public.key`);
  }

}
export default new Config();
