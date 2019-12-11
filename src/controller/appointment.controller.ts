import { AppointmentService } from '../service';

class AppointmentController {
  static getAppointmentsForId(req, res) {
    const { before, after, limit, page } = req.query;

    let advisor: string;
    if (req.params.id !== 'me' && req.advisor.permissionLevel > 1) {
      advisor = req.params.id;
    } else if (req.params.id !== 'me' && req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    } else {
      advisor = req.advisor._id;
    }

    let filterObject: any = {
      advisor
    };

    if (before && new Date(before).toString() !== 'Invalid Date') {
      filterObject = { ...filterObject, endTime: { $gte: new Date(before) } };
    }

    if (after && new Date(after).toString() !== 'Invalid Date') {
      filterObject = { ...filterObject, startTime: { $gte: new Date(after) } };
    }

    AppointmentService.getAppointmentsForFilter(filterObject, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      let appointments = [...result];
      if (limit && !Number.isNaN(+limit)) {
        const offset = page && !Number.isNaN(+page) ? page : 0;
        appointments = appointments.slice(offset * limit, (offset + 1) * limit);
      }

      return res.status(200).send(appointments);
    });
  }

  static createAppointment(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    if (req.advisor.permissionLevel > 1) {
      AppointmentService.addAppointmentOld(req.body, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(201).send(result);
      });
    } else {
      return res.sendStatus(401);
    }
  }
}

export { AppointmentController };
