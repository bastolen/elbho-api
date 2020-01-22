import * as mongoose from 'mongoose';
import { AdvisorService } from '../service';

class LocationController {
  static getLocationForAdvisor(req, res) {
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

    AdvisorService.getById(advisor, false, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }

      const { location } = result;
      const [lon, lat] = location.split(', ');
      return res.status(200).send({ lon, lat });
    });
  }

  static updateMyLocation(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const id = req.advisor._id;
    const { lon, lat } = req.body;
    if (!lon || !lat) {
      return res.sendStatus(400);
    }
    const location = `${lon}, ${lat}`;
    const lastPinged = new Date();
    AdvisorService.updateById(id, { location, lastPinged }, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      const newLocation = result.location;
      const [newLon, newLat] = newLocation.split(', ');
      return res.status(200).send({ lon: newLon, lat: newLat });
    });
  }

  static getLocationWithHash(req, res) {
    const { hash } = req.params;
    res.status(501).send(hash);
  }
}

export { LocationController };
