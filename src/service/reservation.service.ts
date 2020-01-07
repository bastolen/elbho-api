import * as async from 'async';
import { Reservation, Vehicle } from '../model';

class ReservationService {
  static createReservation(reservation, cb) {
    async.waterfall(
      [
        callback => Vehicle.findById(reservation.vehicle, callback).lean(),
        (vehicle, callback) => {
          if (!vehicle) {
            return callback('vehicle not found');
          }
          // Get reservations for the vehicle for the day
          Reservation.find(
            {
              vehicle: reservation.vehicle,
              date: reservation.date,
            },
            callback
          ).lean();
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
            const startCheck =
              nStartTime >= rStartTime && nStartTime <= rEndTime;
            const endCheck = nEndTime >= rStartTime && nEndTime <= rEndTime;
            if (startCheck || endCheck) {
              vehicleFree = false;
            }
          });

          if (vehicleFree) {
            return callback(null, true);
          }
          return callback('used');
        },
        (result, callback) => new Reservation(reservation).save(callback),
      ],
      cb
    );
  }

  static getVehiclesWithReservations(filter, cb) {
    async.parallel(
      {
        reservations: callback => Reservation.find(filter, callback).lean(),
        vehicles: callback => Vehicle.find(callback).lean(),
      },
      (err, results: { vehicles: any[]; reservations: any[] }) => {
        if (err) {
          return cb(err);
        }
        const { reservations, vehicles } = results;

        if (vehicles.length === 0) {
          return cb(null, []);
        }

        const filledVehicles = [];
        vehicles.forEach(vehicle => {
          const newVehicle = { ...vehicle };
          newVehicle.reservations = [];
          const indices: number[] = [];

          reservations.forEach((reservation, index) => {
            if (newVehicle._id.toString() === reservation.vehicle.toString()) {
              indices.push(index);
              newVehicle.reservations.push({ ...reservation });
            }
          });

          indices.forEach(i => {
            reservations.splice(i, 1);
          });
          filledVehicles.push(newVehicle);
        });

        return cb(null, filledVehicles);
      }
    );
  }

  static getReservationsWithVehicles(filter, sort: 'ASC' | 'DESC', cb) {
    let reservations;
    async.waterfall(
      [
        callback =>
          Reservation.find(filter, callback)
            .sort({ start: sort === 'ASC' ? 1 : -1 })
            .lean(),
        (result, callback) => {
          reservations = [...result];

          const vehicleIds = [];
          reservations.forEach(reservation => {
            vehicleIds.push(reservation.vehicle);
          });

          Vehicle.find({ _id: { $in: vehicleIds } }, callback).lean();
        },
        (result, callback) => {
          const vehicles = [...result];
          const totalResult = [];
          reservations.forEach(reservation => {
            const finalReservation = { ...reservation };

            const [reservedVehicle] = vehicles.filter(
              vehicle =>
                vehicle._id.toString() === reservation.vehicle.toString()
            );
            finalReservation.vehicle = reservedVehicle;

            totalResult.push(finalReservation);
          });

          callback(null, totalResult);
        },
      ],
      cb
    );
  }

  static deleteReservation(advisor, reservation, cb) {
    Reservation.deleteOne({ _id: reservation, advisor }, cb);
  }
}

export { ReservationService };
