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
      (request: any, callback) => {
        let availability;
        if (typeof request === 'string') {
          availability = JSON.parse(request);
        } else {
          availability = { ...request };
        }
        const { date, start, end } = availability;
        if (!date || !start || !end) {
          return callback(null);
        }

        let startObject: Date;
        if (start && new Date(start).toString() !== 'Invalid Date') {
          startObject = new Date(start);
        } else {
          return callback(null);
        }

        let endObject: Date;
        if (end && new Date(end).toString() !== 'Invalid Date') {
          endObject = new Date(end);
        } else {
          return callback(null);
        }

        let dateObject: Date;
        if (date && new Date(date).toString() !== 'Invalid Date') {
          dateObject = new Date(date);
          const dateEndObject = new Date(
            dateObject.setUTCHours(23, 59, 59, 999)
          );
          dateObject.setUTCHours(0, 0, 0, 0);

          if (
            dateObject.getTime() > startObject.getTime() ||
            dateObject.getTime() > endObject.getTime() ||
            dateEndObject.getTime() < startObject.getTime() ||
            dateEndObject.getTime() < endObject.getTime()
          ) {
            return callback(null);
          }
        } else {
          return callback(null);
        }

        if (startObject.getTime() > endObject.getTime()) {
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
