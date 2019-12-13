import { Vehicle } from '../model';

class VehicleService {
  static create(vehicle, callback) {
    new Vehicle(vehicle).save(callback);
  }

  static getAll(callback) {
    Vehicle.find(callback);
  }
}

export { VehicleService };
