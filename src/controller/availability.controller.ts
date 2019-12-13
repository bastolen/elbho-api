import * as mongoose from 'mongoose';
import { AvailabilityService } from '../service';

class AvailabilityController {
  static getAvailabilityForAdvisor(req, res) {
    const { before, after } = req.query;

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

    if (!mongoose.Types.ObjectId.isValid(advisor)) {
      res.sendStatus(400);
    }

    const filterObject = {
      advisor,
    };

    let beforeDate;
    if (before && new Date(before).toString() !== 'Invalid Date') {
      beforeDate = new Date(before);
    }

    let afterDate;
    if (after && new Date(after).toString() !== 'Invalid Date') {
      afterDate = new Date(after);
    }

    let filter;
    if (beforeDate && afterDate) {
      // both
      filter = { $gte: afterDate, $lte: beforeDate };
    } else if (beforeDate && !afterDate) {
      // only before
      filter = { $lte: beforeDate };
    } else if (afterDate && !beforeDate) {
      // only after
      filter = { $gte: afterDate };
    }

    if (filter) {
      // @ts-ignore
      filterObject.date = filter;
    }

    AvailabilityService.getAvailabilityForFilter(
      filterObject,
      (err, result) => {
        if (err) {
          return res.sendStatus(500);
        }

        return res.status(200).send(result);
      }
    );
  }

  static setAvailability(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const advisorId = req.advisor._id;
    const { availabilities } = req.body;

    if (!availabilities) {
      return res.sendStatus(400);
    }

    AvailabilityService.setAvailabilityForAdvisor(
      advisorId,
      availabilities,
      err => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.sendStatus(201);
      }
    );
  }
}

export { AvailabilityController };
