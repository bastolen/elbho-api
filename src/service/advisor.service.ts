import * as async from 'async';
import { helper } from '../config';
import { Advisor } from '../model';

class AdvisorService {
  static registerAdvisor(advisor, cb) {
    const newAdvisor = { ...advisor };
    async.waterfall(
      [
        callback => {
          helper.hashPassword(advisor.password, callback);
        },
        (hash, callback) => {
          newAdvisor.password = hash;
          const user = new Advisor(newAdvisor);
          user.save(callback);
        },
      ],
      cb
    );
  }

  static getById(id, cb) {
    async.waterfall(
      [
        callback => Advisor.findById(id, callback).lean(),
        (result, callback) => {
          if (!result) {
            return callback('not found');
          }
          return callback(undefined, result);
        },
      ],
      cb
    );
  }

  static getAll(cb) {
    Advisor.find(cb).lean();
  }

  static updateById(id, newAdvisor, cb) {
    async.waterfall([
      callback => {
        if (newAdvisor.password) {
          return helper.hashPassword(newAdvisor.password, callback);
        }
        return callback(null, false);
      },
      (hash, callback) => {
        const update = { ...newAdvisor };
        if (hash) {
          update.password = hash;
        }
        Advisor.findByIdAndUpdate(id, update, { new: true }, callback);
      }
    ], (err, advisor) => {
      if (err) {
        return cb(err);
      }
      if (!advisor) {
        return cb('not found');
      }
      return cb(undefined, advisor);
    });


  }
}

export { AdvisorService };
