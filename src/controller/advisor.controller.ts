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
      password
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
      return res.sendStatus(400);
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
      password
    };

    AdvisorService.registerAdvisor(newAdvisor, (err, result) => {
      if (err) {
        if (err.code === 11000) {
          return res
            .status(409)
            .send({ error: `Email ${err.keyValue.email} is already in use` });
        }
        return res.sendStatus(500);
      }
      const advisor = result._doc;
      delete advisor.password;
      delete advisor.__v;
      return res.status(201).send(advisor);
    });
  }

  static getById(req, res) {
    if (!req.params || !req.params.id) {
      return res.sendStatus(400);
    }
    const id = req.params.id === 'me' ? req.advisor._id : req.params.id;
    AdvisorService.getById(id, (err, result) => {
      if (err) {
        if (err === 'not found') {
          return res.sendStatus(404);
        }
        return res.sendStatus(500);
      }

      const advisor = { ...result };
      delete advisor.password;
      delete advisor.__v;
      return res.status(200).send(advisor);
    });
  }

  static getAll(req, res) {
    AdvisorService.getAll((err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!result) {
        return res.sendStatus(404);
      }
      const advisors = [];
      result.forEach(advisor => {
        const newAdvisor = advisor;
        delete newAdvisor.password;
        delete newAdvisor.__v;
        advisors.push(newAdvisor);
      });

      return res.send(advisors);
    });
  }

  static updateById(req, res) {
    if (!req.params || !req.params.id) {
      return res.sendStatus(400);
    }

    if (
      req.advisor.permissionLevel === 2 ||
      req.params.id === 'me' ||
      req.advisor._id === req.params.id
    ) {
      const id = req.params.id === 'me' ? req.advisor._id : req.params.id;
      AdvisorService.updateById(id, req.body, (err, result) => {
        if (err) {
          if (err === 'not found') {
            return res.sendStatus(404);
          }
          return res.sendStatus(500);
        }
        return res.send(result);
      });
    } else {
      return res.sendStatus(403);
    }
  }
}

export { AdvisorController };
