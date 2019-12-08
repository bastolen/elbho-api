import { AppointmentService } from '../service';

class RequestController {
  static getRequestForAdvisor(req, res) {
    res.sendStatus(501);
  }

  static createRequest(req, res) {
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
      res.sendStatus(400);
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
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    )
  }

  static updateRequest(req, res) {
    res.sendStatus(501);
  }
}

export { RequestController };
