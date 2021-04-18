import * as bcrypt from 'bcrypt';

export default class Bcrypt {
  public static hash(value: string, salt: string) {
    return bcrypt.hash(value, salt);
  }

  public static compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  public static createSalt() {
    return bcrypt.genSalt();
  }
}
