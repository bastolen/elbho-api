import * as express from 'express';
import { LocationController } from '../controller';

const app = express();

app.get('/:id', LocationController.getMyLocation)
app.put('', LocationController.updateMyLocation);

export default app;
