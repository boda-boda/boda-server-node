import * as bcrypt from 'bcrypt';

export default class Bcrypt {
  public static async hash(value: string, salt: string) {
    return await bcrypt.hash(value, salt);
  }

  public static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  public static async createSalt() {
    return await bcrypt.genSalt();
  }
}
