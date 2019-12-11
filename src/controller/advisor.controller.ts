import * as mongoose from 'mongoose';
import { AdvisorService } from '../service';

class AdvisorController {
  static register(req, res) {
    if (req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    }

    if (!req.body) {
      return res.sendStatus(400);
    }

    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      active,
      status,
      workArea,
      region,
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
      !workArea ||
      !region ||
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
      workArea,
      region,
      email,
      password
    };

    AdvisorService.registerAdvisor(newAdvisor, (err, result) => {
      if (err) {
        if (err.code === 11000) {
          return res
            .status(409)
            .send(`Email ${email} is already in use`);
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
    let id: string;
    if (req.params.id !== 'me' && req.advisor.permissionLevel > 1) {
      id = req.params.id;
    } else if (req.params.id !== 'me' && req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    } else {
      id = req.advisor._id;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.sendStatus(400);
    }

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
      const advisors = [];
      result.forEach(advisor => {
        const newAdvisor = { ...advisor };
        delete newAdvisor.password;
        delete newAdvisor.__v;
        advisors.push(newAdvisor);
      });

      return res.send(advisors);
    });
  }

  static updateById(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    let id: string;
    if (req.params.id !== 'me' && req.advisor.permissionLevel > 1) {
      id = req.params.id;
    } else if (req.params.id !== 'me' && req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    } else {
      id = req.advisor._id;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.sendStatus(400);
    }

    const newAdvisor = { ...req.body };
    if (newAdvisor.permissionLevel && req.advisor.permissionLevel <= 1) {
      delete newAdvisor.permissionLevel;
    }

    AdvisorService.updateById(id, newAdvisor, (err, result) => {
      if (err) {
        if (err === 'not found') {
          return res.sendStatus(404);
        }
        return res.sendStatus(500);
      }
      const advisor = { ...result._doc };
      delete advisor.password;
      delete advisor.__v;
      return res.send(advisor);
    });
  }
}

export { AdvisorController };
