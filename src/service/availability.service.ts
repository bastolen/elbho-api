import * as async from 'async';
import { Availability } from '../model';

class AvailabilityService {
  static getAvailabilityForFilter(filterObject, cb) {
    Availability.find(filterObject, cb).lean();
  }

  static setAvailabilityForAdvisor(advisorId, availabilities, cb) {
    async.eachLimit(
      availabilities,
      10,
      (availability: any, callback) => {
        const { date, start, end } = availability;
        if (!date || !start || !end) {
          return callback(null);
        }

        let dateObject;
        if (date && new Date(date).toString() !== 'Invalid Date') {
          dateObject = new Date(date);
        } else {
          return callback(null);
        }

        let startObject;
        if (start && new Date(start).toString() !== 'Invalid Date') {
          startObject = new Date(start);
        } else {
          return callback(null);
        }

        let endObject;
        if (end && new Date(end).toString() !== 'Invalid Date') {
          endObject = new Date(end);
        } else {
          return callback(null);
        }

        const newAvailability = {
          advisor: advisorId,
          date: dateObject,
          start: startObject,
          end: endObject,
        };

        Availability.update(
          { date: dateObject },
          newAvailability,
          { upsert: true, setDefaultsOnInsert: true },
          callback
        );
      },
      cb
    );
  }
}

export { AvailabilityService };
