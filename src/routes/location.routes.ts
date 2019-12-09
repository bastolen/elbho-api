import * as express from 'express';
import { LocationController } from '../controller';

const app = express();

app.get('', LocationController.getMyLocation)
app.put('', LocationController.updateMyLocation);

export default app;
