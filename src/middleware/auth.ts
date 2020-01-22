import { waterfall } from 'async';
import * as mongoose from 'mongoose';
import { helper } from '../config';
import { AdvisorService } from '../service';

const AuthMiddleWare = (req, res, next) => {
  const { authorization } = req.headers;
  if (
    authorization &&
    authorization.split(' ').length === 2 &&
    authorization
      .split(' ')[0]
      .toLowerCase()
      .includes('bearer') &&
    authorization.split(' ')[1].length > 0
  ) {
    waterfall(
      [
        callback => helper.validateToken(authorization.split(' ')[1], callback),
        (decoded, callback) => {
          if (!decoded || !(decoded as any)._id) {
            return callback('invalid');
          }
          if (
            !mongoose.Types.ObjectId.isValid(
              new mongoose.Types.ObjectId((decoded as any)._id)
            )
          ) {
            return callback('invalid');
          }
          AdvisorService.getById((decoded as any)._id, true, callback);
        },
        (result, callback) => {
          if (!result) {
            return callback('notfound');
          }
          const advisor = { ...result };
          delete advisor.password;
          delete advisor.__v;
          callback(null, advisor);
        },
      ],

      (err, advisor) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.advisor = advisor;
        next();
      }
    );
  } else {
    return res.sendStatus(403);
  }
};

export default AuthMiddleWare;
