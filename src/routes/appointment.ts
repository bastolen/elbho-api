import * as express from 'express';
import { AppointmentController } from '../controller';

const app = express();

app.get('/:id', AppointmentController.getAppointmentsForId);
app.post('', AppointmentController.createAppointment);

export default app;
