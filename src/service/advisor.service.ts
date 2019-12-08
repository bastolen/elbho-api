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
    Advisor.findByIdAndUpdate(id, newAdvisor, { new: true }, (err, advisor) => {
      if (err) {
        return cb(err);
      }
      if (!advisor) {
        return cb('not found');
      }
      return cb(undefined, advisor);
    })
  }
}

export { AdvisorService };
