import * as express from 'express';
import { AvailabilityController } from '../controller/availability.controller';

const app = express();

app.get('/:id', AvailabilityController.getAvailability);
app.post('', AvailabilityController.setAvailability);

export default app;
