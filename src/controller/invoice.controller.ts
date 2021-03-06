import * as mongoose from 'mongoose';
import { InvoiceService } from '../service';

class InvoiceController {
  static addInvoice(req, res) {
    if (!req.body || !req.file || !req.body.date) {
      return res.sendStatus(400);
    }

    const { file } = req;
    const fileName = file.originalname;
    const invoiceDate = req.body.date;
    const advisorId = req.advisor._id;

    let dateString;

    if (new Date(invoiceDate).toString() === 'Invalid Date') {
      if (
        new Date(
          invoiceDate.substring(1, invoiceDate.length - 1)
        ).toString() === 'Invalid Date' ||
        invoiceDate.length !== 26
      ) {
        return res.sendStatus(400);
      }
      dateString = invoiceDate.substring(1, invoiceDate.length - 1);
    } else {
      dateString = invoiceDate;
    }

    const date = new Date(dateString);
    const now = new Date();

    if (date.getTime() > now.getTime()) {
      return res.sendStatus(406);
    }

    InvoiceService.addInvoice(
      advisorId,
      date,
      fileName,
      file,
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(201).send(result);
      }
    );
  }

  static getInvoiceForAdvisor(req, res) {
    let advisor: string;
    if (req.params.advisorId !== 'me' && req.advisor.permissionLevel > 1) {
      advisor = req.params.advisorId;
    } else if (
      req.params.advisorId !== 'me' &&
      req.advisor.permissionLevel <= 1
    ) {
      return res.sendStatus(403);
    } else {
      advisor = req.advisor._id;
    }

    if (
      !mongoose.Types.ObjectId.isValid(new mongoose.Types.ObjectId(advisor))
    ) {
      res.sendStatus(400);
    }

    InvoiceService.getInvoicesForAdvisor(advisor, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(result);
    });
  }
}

export { InvoiceController };
