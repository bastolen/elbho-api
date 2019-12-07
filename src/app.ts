import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { AuthController, LocationController } from './controller';
import { authMiddleWare } from './middleware';
import { advisor, availability, invoice, location } from './routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DBURL = process.env.DB || 'mongodb://localhost:27017/elbho';

// MIDDLEWARE
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', AuthController.login);
app.get('/advisorlocation/:hash', LocationController.getLocationWithHash);

// MIDDLEWARE FOR AUTH
app.use('/auth', authMiddleWare);
app.use('/auth/advisor', advisor);
app.use('/auth/availability', availability);
app.use('/auth/invoice', invoice);
app.use('/auth/location', location);

// ROUTE NOT FOUND
app.use('*', (req, res) => {
  console.warn(`Called route(${req.originalUrl}) not found`);
  res.status(404).send({ code: 404, message: 'route not found' });
});

// START THE SERVER
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch(() => console.error("Couldn't connect to the database"))
  .then(() => console.info(`Connected to the database!`));

app.listen(PORT, () => {
  console.info(`App running on port ${PORT}`);
});
