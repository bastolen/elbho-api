import * as async from 'async';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SALTROUNDS = +process.env.SALTROUNDS || 10;
const SECRET = process.env.JWTSECRET || 'VerySecure';

class helper {
  static hashPassword(string: string, cb: (err: Error, hash: string) => void) {
    async.waterfall(
      [
        callback => {
          bcrypt.genSalt(SALTROUNDS, callback);
        },
        (salt: string, callback) => {
          bcrypt.hash(string, salt, callback);
        },
      ],
      cb
    );
  }

  static checkPasswword(
    password: string,
    hash: string,
    cb: (err: Error, res: boolean) => void
  ) {
    bcrypt.compare(password, hash, cb);
  }

  static generateToken(obj: object, cb: (err: Error, token: string) => void) {
    jwt.sign(obj, SECRET, (err, token) => {
      const date = new Date();
      date.setHours(date.getHours() + 1);
      cb(err, token);
    });
  }

  static validateToken(token: string, cb: jwt.VerifyCallback) {
    jwt.verify(token, SECRET, cb);
  }
}

export { helper };
