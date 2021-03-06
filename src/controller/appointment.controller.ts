import * as mongoose from 'mongoose';
import { AppointmentService } from '../service';

class AppointmentController {
  static getAppointmentsForId(req, res) {
    const { before, after, limit, page, sort } = req.query;

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
      return res.sendStatus(400);
    }

    let filterObject: any = {
      advisor,
      endTime: { $exists: true },
    };

    if (before && new Date(before).toString() !== 'Invalid Date') {
      filterObject = {
        ...filterObject,
        endTime: { ...filterObject.endTime, $lte: new Date(before) },
      };
    }

    if (after && new Date(after).toString() !== 'Invalid Date') {
      filterObject = {
        ...filterObject,
        endTime: { ...filterObject.endTime, $gte: new Date(after) },
      };
    }
    const sortPrepared = sort && sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    AppointmentService.getAppointmentsForFilter(
      filterObject,
      sortPrepared,
      (err, result) => {
        if (err) {
          return res.sendStatus(500);
        }
        let appointments = [...result];
        if (limit && !Number.isNaN(+limit)) {
          const offset = page && !Number.isNaN(+page) ? page : 0;
          appointments = appointments.slice(
            offset * limit,
            (offset + 1) * limit
          );
        }

        return res.status(200).send(appointments);
      }
    );
  }

  /* DEPRECATED, used for testing */
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
