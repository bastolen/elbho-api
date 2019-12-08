import * as express from 'express';
import { RequestController } from '../controller';

const app = express();

app.get('/:id', RequestController.getRequestForAdvisor);
app.post('', RequestController.createRequest);
app.put('/:id', RequestController.updateRequest);

export default app;
