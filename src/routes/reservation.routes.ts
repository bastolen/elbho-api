import * as express from 'express';
import { ReservationController } from '../controller';

const app = express();

app.post('', ReservationController.createReservation);
app.get('', ReservationController.getReservations);
app.get('/:advisorId', ReservationController.getReservationsForAdvisor);
app.delete('/:id', ReservationController.deleteReservation);

export default app;
