import * as express from 'express';
import { LocationController } from '../controller';

const app = express();

app.get('/:advisorId', LocationController.getLocationForAdvisor);
app.put('', LocationController.updateMyLocation);

export default app;
