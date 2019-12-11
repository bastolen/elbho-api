import * as express from 'express';
import { RequestController } from '../controller';

const app = express();

app.get('/:advisorId', RequestController.getRequestForAdvisor);
app.post('', RequestController.createRequest);
app.put('/:appointmentId', RequestController.updateRequestForAppointment);

export default app;
