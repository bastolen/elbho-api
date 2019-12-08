import * as async from 'async';
import { Appointment, Request } from '../model';

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

  static addAppointmentOld(appointment, cb) {
    const newAppointment = new Appointment(appointment);
    newAppointment.save(cb);
  }

  static newAppointment(newAppointment, advisors, cb) {
    let appointmentId;
    async.waterfall([
      callback => new Appointment(newAppointment).save(callback),
      (appointment, callback) => {
        appointmentId = appointment._id;
        const advisorList = [];

        advisors.forEach(advisor => {
          advisorList.push({
            advisor
          })
        });

        new Request({
          appointment: appointment._id,
          currentAdvisor: advisors[0],
          advisors: advisorList
        }).save(callback);
      },
      (request, callback) => Appointment.findById(appointmentId, callback).lean()
    ],
      cb
    );
  }
}

export { AppointmentService };
