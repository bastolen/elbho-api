import { AdvisorService } from '../service';

class LocationController {
  static getMyLocation(req, res) {
    const id = req.params.id === 'me' ? req.advisor._id : req.params.id;
    AdvisorService.getById(id, (err, result) => {
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
    const lastPinged = new Date()
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
