import { VehicleService } from '../service';

class VehicleController {
  static createVehicle(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    if (req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    }

    const { licensePlate, brand, model, location, image } = req.body;
    if (!licensePlate || !brand || !model || !location || !image) {
      return res.sendStatus(400);
    }

    VehicleService.create(
      { licensePlate, brand, model, location, image },
      (err, result) => {
        if (err) {
          if (err.code === 11000) {
            return res
              .status(409)
              .send(`Licenseplate ${licensePlate} is already in use`);
          }
          return res.sendStatus(500);
        }
        return res.status(201).send(result);
      }
    );
  }

  static getAll(req, res) {
    const { limit, page } = req.query;
    VehicleService.getAll((err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      let vehicles = [...result];
      if (limit && !Number.isNaN(+limit)) {
        const offset = page && !Number.isNaN(+page) ? page : 0;
        vehicles = vehicles.slice(offset * limit, (offset + 1) * limit);
      }
      return res.send(vehicles);
    });
  }
}

export { VehicleController };
