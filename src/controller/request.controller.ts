import { AppointmentService } from '../service';

class RequestController {
  static getRequestForAdvisor(req, res) {
    const advisorId = req.params.id === 'me' ? req.advisor._id : req.params.id;
    AppointmentService.getAppointmentsForRequestAdvisor(advisorId, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(result);
    });
  }

  static createRequest(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
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
      advisors
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
    AppointmentService.newAppointment(
      {
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
        advisors
      },
      advisors,
      (err, result) => {
        if (err) {
          if (err === 'no advisors included') {
            return res.status(409).send('no advisors found for the included ids');
          }
          return res.sendStatus(500);
        }
        return res.status(201).send(result);
      }
    )
  }

  static updateRequest(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { accept } = req.body;
    const advisorId = req.advisor._id;
    const appointmentId = req.params.id;

    if (typeof accept === 'undefined') {
      return res.sendStatus(400);
    }

    AppointmentService.respondToRequest(appointmentId, advisorId, accept, (err) => {
      if (err) {
        if (err === 'no request found') {
          return res.status(409).send('no request found for this id');
        }
        return res.status(500).send(err);
      }

      return res.sendStatus(202);
    })
  }
}

export { RequestController };
