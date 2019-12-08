import * as async from 'async';
import { helper } from '../config';
import { Advisor } from '../model';

class AuthService {
  static login(email: string, password: string, cb) {
    async.waterfall(
      [
        callback => Advisor.findOne({ email }, callback).lean(),
        (advisor, callback) => {
          if (!advisor) {
            return callback('not found');
          }
          helper.checkPasswword(password, advisor.password, (err, res) => {
            callback(err, advisor, res);
          });
        },
        (result, success, callback) => {
          if (!success) {
            return callback('wrong password');
          }
          const advisor = { ...result };
          delete advisor.password;
          delete advisor.__v;
          helper.generateToken(advisor, callback);
        },
      ],
      cb
    );
  }
}

export { AuthService };
