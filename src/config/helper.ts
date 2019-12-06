import * as async from 'async';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SALTROUNDS = +process.env.saltRounds || 10;
const SECRET = process.env.JWTSecret || 'VerySecure';

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

  static generateToken(
    obj: object,
    cb: (err: Error, res: { token: string; expires: number }) => void
  ) {
    jwt.sign(obj, SECRET, { expiresIn: '1h' }, (err, token) => {
      const date = new Date();
      date.setHours(date.getHours() + 1);
      cb(err, { token, expires: date.getTime() });
    });
  }

  static validateToken(token: string, cb: jwt.VerifyCallback) {
    jwt.verify(token, SECRET, cb);
  }
}

export { helper };
