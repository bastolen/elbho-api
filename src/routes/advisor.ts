import * as express from 'express';
import { AdvisorController } from '../controller';

const app = express();

app.post('', AdvisorController.register);
app.get('', AdvisorController.getAll);
app.get('/:id', AdvisorController.getById);
app.put('/:id', AdvisorController.updateById);

export default app;
