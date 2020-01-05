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
          console.log('availability.service.ts:16');
          return callback(null);
        }

        let dateObject: Date;
        if (date && new Date(date).toString() !== 'Invalid Date') {
          dateObject = new Date(date);
        } else {
          console.log('availability.service.ts:24');
          return callback(null);
        }

        let startObject: Date;
        if (start && new Date(start).toString() !== 'Invalid Date') {
          startObject = new Date(start);
        } else {
          console.log('availability.service.ts:32');
          return callback(null);
        }

        let endObject: Date;
        if (end && new Date(end).toString() !== 'Invalid Date') {
          endObject = new Date(end);
        } else {
          console.log('availability.service.ts:40');
          return callback(null);
        }

        if (startObject.getTime() === endObject.getTime()) {
          Availability.findOneAndDelete(
            {
              advisor: advisorId,
              date: dateObject,
            },
            callback
          );
        } else {
          const newAvailability = {
            advisor: advisorId,
            date: dateObject,
            start: startObject,
            end: endObject,
          };

          Availability.updateOne(
            { date: dateObject, advisor: advisorId },
            newAvailability,
            { upsert: true, setDefaultsOnInsert: true },
            callback
          );
        }
      },
      cb
    );
  }
}

export { AvailabilityService };
