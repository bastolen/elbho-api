import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { AuthController, LocationController } from './controller';
import { AuthMiddleWare } from './middleware';
import { AdvisorRoutes, AppointmentRoutes, AvailabilityRoutes, InvoiceRoutes, LocationRoutes, RequestRoutes, ReservationRoutes, VehicleRoutes } from './routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DBURL = process.env.DB || 'mongodb://localhost:27017/elbho';

// MIDDLEWARE
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/login', AuthController.login);

app.get('/advisorlocation/:hash', LocationController.getLocationWithHash);

// MIDDLEWARE FOR AUTH
app.use('/auth', AuthMiddleWare);

// Protected routes
app.use('/auth/advisor', AdvisorRoutes);
app.use('/auth/availability', AvailabilityRoutes);
app.use('/auth/invoice', InvoiceRoutes);
app.use('/auth/location', LocationRoutes);
app.use('/auth/appointment', AppointmentRoutes);
app.use('/auth/request', RequestRoutes);
app.use('/auth/vehicle', VehicleRoutes);
app.use('/auth/reservation', ReservationRoutes);

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
    useFindAndModify: false
  })
  .catch(() => console.error("Couldn't connect to the database"))
  .then(() => console.info(`Connected to the database!`));

app.listen(PORT, () => {
  console.info(`App running on port ${PORT}`);
});
