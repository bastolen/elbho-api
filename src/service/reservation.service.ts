import * as async from 'async';
import { Reservation } from '../model';

class ReservationService {
  static createReservation(reservation, cb) {
    async.waterfall([
      (callback) => {
        // Get reservations for the vehicle for the day
        Reservation.find({
          vehicle: reservation.vehicle,
          date: reservation.date
        }, callback).lean();
      },
      (result, callback) => {
        // Check if the vehicle has reservations
        const reservations = [...result];
        if (reservation.length === 0) {
          return callback(null, true);
        }
        let carFree = true;
        // Check if the reservations are in the same time frame
        reservations.forEach(r => {
          const rStartTime = r.start.getTime();
          const rEndTime = r.end.getTime();
          const nStartTime = reservation.start.getTime();
          const nEndTime = reservation.end.getTime();
          const startCheck = nStartTime >= rStartTime && nStartTime <= rEndTime;
          const endCheck = nEndTime >= nStartTime && nEndTime <= rEndTime;
          if (startCheck || endCheck) {
            carFree = false;
          }
        })

        if (carFree) {
          return callback(null, true)
        }
        return callback('used');
      },
      (result, callback) => new Reservation(reservation).save(callback)
    ], cb);
  }
}

export { ReservationService };
