import * as async from 'async';
import { Reservation, Vehicle } from '../model';

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
        let vehicleFree = true;
        // Check if the reservations are in the same time frame
        reservations.forEach(r => {
          const rStartTime = r.start.getTime();
          const rEndTime = r.end.getTime();
          const nStartTime = reservation.start.getTime();
          const nEndTime = reservation.end.getTime();
          const startCheck = nStartTime >= rStartTime && nStartTime <= rEndTime;
          const endCheck = nEndTime >= nStartTime && nEndTime <= rEndTime;
          if (startCheck || endCheck) {
            vehicleFree = false;
          }
        })

        if (vehicleFree) {
          return callback(null, true)
        }
        return callback('used');
      },
      (result, callback) => new Reservation(reservation).save(callback)
    ], cb);
  }

  static getVehiclesWithReservations(filter, cb) {
    async.parallel({
      reservations: (callback) => Reservation.find(filter, callback).lean(),
      vehicles: (callback) => Vehicle.find(callback).lean()
    }, (err, results: { vehicles: any[], reservations: any[] }) => {
      if (err) {
        return cb(err);
      }
      const { reservations, vehicles } = results;

      if (vehicles.length === 0) {
        return cb(null, []);
      }

      const filledVehicles = []
      vehicles.forEach(vehicle => {
        const newVehicle = { ...vehicle };
        newVehicle.reservations = [];
        const indices: number[] = [];

        reservations.forEach((reservation, index) => {
          console.log('reservation.service.ts:64 | vehicle: ', newVehicle._id);
          console.log('reservation.service.ts:65 | id: ', reservation.vehicle);

          if (newVehicle._id.toString() === reservation.vehicle.toString()) {
            console.log('reservation.service.ts:65');
            indices.push(index);
            newVehicle.reservations.push({ ...reservation })
          }
        });

        indices.forEach(i => {
          reservations.splice(i, 1);
        });
        filledVehicles.push(newVehicle);
      });

      return cb(null, filledVehicles);
    });

  }
}

export { ReservationService };
