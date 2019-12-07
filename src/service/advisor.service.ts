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
}

export { AdvisorService };
