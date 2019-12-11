import * as async from 'async';
import * as mongoose from 'mongoose';
import { Advisor, Appointment, Request } from '../model';

class AppointmentService {
  static getAppointmentsForFilter(filterObject, cb) {
    async.waterfall(
      [
        callback => Appointment.find(filterObject, callback).lean(),
        (result, callback) => {
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
    const advisorList = [];
    let invalid = false;
    advisors.forEach(adv => {
      if (!mongoose.Types.ObjectId.isValid(adv)) {
        invalid = true;
      }
    });
    if (invalid) {
      return cb('invalid id');
    }
    async.waterfall([
      callback => Advisor.find({ _id: { $in: advisors } }, callback).lean(),
      (foundAdvisors, callback) => {
        if (foundAdvisors.length === 0) {
          return callback('no advisors included')
        }
        foundAdvisors.forEach(advisor => {
          advisorList.push({ advisor: advisor._id });
        });
        new Appointment(newAppointment).save(callback);
      },
      (appointment, callback) => {
        appointmentId = appointment._id;

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

  static getAppointmentsForRequestAdvisor(advisorId, cb) {
    async.waterfall([
      callback => Request.find({ currentAdvisor: advisorId, accepted: false }, callback).lean(),
      (requests, callback) => {
        if (requests.length === 0) {
          return callback(undefined, [])
        }
        const appointmentIds = [];
        requests.forEach(request => {
          appointmentIds.push(request.appointment);
        });

        this.getAppointmentsForFilter({ '_id': { $in: appointmentIds } }, callback);
      }
    ], cb);
  }

  static respondToRequest(appointmentId, advisorId, response, cb) {
    async.waterfall([
      callback => Request.find({ appointment: appointmentId }, callback),
      (requests, callback) => {
        const request = requests[0];
        if (!request) {
          return callback('no request found')
        }
        if (response) {
          request.accepted = true;
        }
        request.advisors.forEach((advisor, index) => {
          if (advisor.advisor.equals(advisorId)) {
            advisor.accepted = response;
            advisor.responded = true;
            request.currentAdvisorIndex = index;
          }
        });

        request.save(callback)
      },
      (request, callback) => Appointment.findByIdAndUpdate(appointmentId, { advisor: advisorId }, callback)
    ], cb);

  }
}

export { AppointmentService };
