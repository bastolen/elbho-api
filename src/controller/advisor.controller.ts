import { AdvisorService } from '../service';

class AdvisorController {
  static register(req, res) {
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      active,
      status,
      location,
      workArea,
      region,
      permissionLevel,
      email,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !phoneNumber ||
      typeof active === 'undefined' ||
      !status ||
      !location ||
      !workArea ||
      !region ||
      !permissionLevel ||
      !email ||
      !password
    ) {
      res.send(400);
    }
    const newAdvisor = {
      firstName,
      lastName,
      gender,
      phoneNumber,
      active,
      status,
      location,
      workArea,
      region,
      permissionLevel,
      email,
      password,
    };

    AdvisorService.registerAdvisor(newAdvisor, (err, result) => {
      if (err) {
        if (err.code === 11000) {
          return res
            .status(409)
            .send(`Email ${err.keyValue.email} is already in use`);
        }
        return res.sendStatus(500);
      }
      const advisor = { ...result };
      delete advisor.password;
      delete advisor.__v;
      return res.status(201).send(advisor);
    });
  }

  static get(req, res) {
    if (!req.params || !req.params.id) {
      return res.sendStatus(400);
    }
    const id = req.params.id === 'me' ? req.advisor._id : req.params.id;
    res.send(id);
  }

  static getAll(req, res) { }
}

export { AdvisorController };
