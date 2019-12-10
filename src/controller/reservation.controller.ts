import { ReservationService } from "../service";

class ReservationController {
  static createReservation(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    const {
      vehicle,
      date,
      start,
      end
    } = req.body;
    if (!vehicle || !date || !start || !end) {
      return res.sendStatus(400);
    }

    if (
      new Date(date).toString() === 'Invalid Date' ||
      new Date(start).toString() === 'Invalid Date' ||
      new Date(end).toString() === 'Invalid Date'
    ) {
      return res.sendStatus(400);
    }

    const dateDate = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    const advisor = req.advisor._id;
    ReservationService.createReservation({
      vehicle,
      advisor,
      date: dateDate,
      start: startDate,
      end: endDate
    }, (err, result) => {
      if (err) {
        if (err === 'used') {
          return res.status(409).send({ error: 'vehicle already reserved' });
        }
        return res.sendStatus(500);
      }
      return res.status(201).send(result);
    });
  }

  static getReservations(req, res) {
    let filter = {};

    if (req.query && new Date(req.query.after).toString() !== 'Invalid Date') {
      filter = { date: { $gte: new Date(req.query.after) } };
    }

    if (req.query && new Date(req.query.date).toString() !== 'Invalid Date') {
      filter = { date: new Date(req.query.date) };
    }

    ReservationService.getVehiclesWithReservations(filter, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.send(result);
    });
  }

  static getReservationsForAdvisor(req, res) {
    const advisor = req.params.id === 'me' ? req.advisor._id : req.params.id;

    let filter: { advisor, date?} = { advisor };
    if (req.query && new Date(req.query.after).toString() !== 'Invalid Date') {
      filter = { ...filter, date: { $gte: new Date(req.query.after) } };
    }

    ReservationService.getReservationsWithVehicles(filter, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.send(result);
    });
  }

  static deleteReservation(req, res) {
    const advisor = req.advisor._id;
    const reservation = req.params.id;

    ReservationService.deleteReservation(advisor, reservation, (err, result) => {
      if (err) {
        return res.sendStatus(500)
      }
      if (result.deletedCount === 0) {
        return res.status(401).send({ error: 'Not your reservation' });
      }
      return res.sendStatus(200);
    });
  }
}

export { ReservationController };
