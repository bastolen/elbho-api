import * as express from 'express';
import { ReservationController } from '../controller';

const app = express();

app.post('', ReservationController.createReservation);
app.get('', ReservationController.getReservations)

export default app;
