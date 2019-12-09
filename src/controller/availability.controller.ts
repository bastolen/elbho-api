import { AvailabilityService } from "../service";

class AvailabilityController {
  static getAvailability(req, res) {
    const { before, after } = req.query;
    const advisorId = req.params.id === 'me' ? req.advisor._id : req.params.id;
    const filterObject = {
      advisor: advisorId
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

    AvailabilityService.getAvailabilityForFilter(filterObject, (err, result) => {
      if (err) {
        if (err === 'not found') {
          return res.sendStatus(404);
        }
        return res.sendStatus(500);
      }

      return res.status(200).send(result);
    })
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

    AvailabilityService.setAvailabilityForAdvisor(advisorId, availabilities, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.sendStatus(201);
    });
  }
}

export { AvailabilityController };
