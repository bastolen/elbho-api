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
      firstChoice,
      secondChoice,
      thirdChoice
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
      !firstChoice
    ) {
      return res.sendStatus(400);
    }
    const advisors = [firstChoice];
    if (secondChoice) {
      advisors.push(secondChoice);
    }
    if (thirdChoice) {
      advisors.push(thirdChoice);
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
        firstChoice,
        secondChoice,
        thirdChoice
      },
      advisors,
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
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
        return res.status(500).send(err);
      }

      return res.sendStatus(202);
    })
  }
}

export { RequestController };
