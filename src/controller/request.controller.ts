import * as mongoose from 'mongoose';
import { AppointmentService } from '../service';

class RequestController {
  static getRequestForAdvisor(req, res) {
    let advisor: string;
    if (req.params.advisorId !== 'me' && req.advisor.permissionLevel > 1) {
      advisor = req.params.advisorId;
    } else if (
      req.params.advisorId !== 'me' &&
      req.advisor.permissionLevel <= 1
    ) {
      return res.sendStatus(403);
    } else {
      advisor = req.advisor._id;
    }

    if (
      !mongoose.Types.ObjectId.isValid(new mongoose.Types.ObjectId(advisor))
    ) {
      res.sendStatus(400);
    }

    AppointmentService.getAppointmentsForRequestAdvisor(
      advisor,
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send(result);
      }
    );
  }

  static createRequest(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    if (req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    }

    const {
      startTime,
      endTime,
      comment,
      address,
      contactPersonName,
      contactPersonPhoneNumber,
      contactPersonFunction,
      contactPersonEmail,
      active,
      website,
      logo,
      cocNumber,
      cocName,
      advisors,
    } = req.body;

    if (
      !startTime ||
      !endTime ||
      !comment ||
      !address ||
      !contactPersonName ||
      !contactPersonPhoneNumber ||
      !contactPersonFunction ||
      !contactPersonEmail ||
      typeof active === 'undefined' ||
      !website ||
      !logo ||
      !cocNumber ||
      !cocName ||
      !advisors
    ) {
      return res.sendStatus(400);
    }

    if (new Date(startTime).toString() === 'Invalid Date') {
      return res.sendStatus(400);
    }

    if (new Date(endTime).toString() === 'Invalid Date') {
      return res.sendStatus(400);
    }

    const endDate = new Date(endTime);
    const startDate = new Date(startTime);

    if (endDate.getTime() < startDate.getTime()) {
      return res.sendStatus(406);
    }

    AppointmentService.newAppointment(
      {
        startTime: startDate,
        endTime: endDate,
        comment,
        address,
        contactPersonName,
        contactPersonPhoneNumber,
        contactPersonFunction,
        contactPersonEmail,
        active,
        website,
        logo,
        cocNumber,
        cocName,
        advisors,
      },
      advisors,
      (err, result) => {
        if (err) {
          if (err === 'no advisors included') {
            return res
              .status(409)
              .send('no advisors found for the included ids');
          }

          if (err === 'invalid id') {
            return res.sendStatus(400);
          }
          return res.sendStatus(500);
        }
        return res.status(201).send(result);
      }
    );
  }

  static updateRequestForAppointment(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { accept } = req.body;
    const advisorId = req.advisor._id;
    const { appointmentId } = req.params;

    if (typeof accept === 'undefined') {
      return res.sendStatus(400);
    }

    AppointmentService.respondToRequest(
      appointmentId,
      advisorId,
      accept,
      err => {
        if (err) {
          if (err === 'no request found') {
            return res.status(409).send('no request found for this id');
          }
          return res.status(500).send(err);
        }

        return res.sendStatus(202);
      }
    );
  }
}

export { RequestController };
