import * as express from 'express';
import { VehicleController } from '../controller';

const app = express();

app.post('', VehicleController.createVehicle);
app.get('', VehicleController.getAll);

export default app;
