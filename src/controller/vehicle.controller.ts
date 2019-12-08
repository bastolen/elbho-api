import { VehicleService } from "../service";

class VehicleController {
  static createVehicle(req, res) {
    const { licensePlate, brand, model, location } = req.body;
    if (!licensePlate || !brand || !model || !location) {
      return res.sendStatus(400);
    }

    VehicleService.create({ licensePlate, brand, model, location }, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(201).send(result);
    })
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
    })
  }

}

export { VehicleController };
