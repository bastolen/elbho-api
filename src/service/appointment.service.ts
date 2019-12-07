import * as async from 'async';
import { Appointment } from '../model';

class AppointmentService {
  static getAppointmentsForFilter(filterObject, cb) {
    async.waterfall(
      [
        callback => Appointment.find(filterObject, callback).lean(),
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

  static addAppointment(appointment, cb) {
    const newAppointment = new Appointment(appointment);
    newAppointment.save(cb);
  }
}

export { AppointmentService };
