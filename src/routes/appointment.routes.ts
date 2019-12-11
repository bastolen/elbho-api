import * as express from 'express';
import { AppointmentController } from '../controller';

const app = express();

app.get('/:advisorId', AppointmentController.getAppointmentsForId);
/* DEPRECATED, used for testing */
// app.post('', AppointmentController.createAppointment);

export default app;
