import { AppointmentService } from '../service';

class AppointmentController {
  static getAppointmentsForId(req, res) {
    const { before, after, limit, page } = req.query;
    const advisorId = req.params.id === 'me' ? req.advisor._id : req.params.id;
    const filterObject = {
      advisor: advisorId
    };

    if (before && new Date(before).toString() !== 'Invalid Date') {
      // @ts-ignore
      filterObject.endTime = { $gte: new Date(before) };
    }

    if (after && new Date(after).toString() !== 'Invalid Date') {
      // @ts-ignore
      filterObject.startTime = { $gte: new Date(after) };
    }

    AppointmentService.getAppointmentsForFilter(filterObject, (err, result) => {
      if (err) {
        if (err === 'not found') {
          return res.sendStatus(404);
        }
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
    if (req.advisor.permissionLevel > 1) {
      AppointmentService.addAppointment(req.body, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      });
    } else {
      res.sendStatus(401);
    }
  }
}

export { AppointmentController };
