import * as express from 'express';
import { AvailabilityController } from '../controller/availability.controller';

const app = express();

app.get('/:advisorId', AvailabilityController.getAvailabilityForAdvisor);
app.post('', AvailabilityController.setAvailability);

export default app;
