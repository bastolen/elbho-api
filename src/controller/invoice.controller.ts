import * as mongoose from 'mongoose';
import { InvoiceService } from '../service';

class InvoiceController {
  static addInvoice(req, res) {
    if (!req.body || !req.file || !req.body.date) {
      console.log('invoice.controller.ts:7 | : ', req.body.date);
      console.log('invoice.controller.ts:8 | : ', req.file);
      return res.sendStatus(400);
    }

    const { file } = req;
    const fileName = file.originalname;
    const invoiceDate = req.body.date;
    const advisorId = req.advisor._id;

    if (new Date(invoiceDate).toString() === 'Invalid Date') {
      console.log('invoice.controller.ts:18 | : ', invoiceDate);
      console.log('invoice.controller.ts:19 | : ', 'invalid date');
      return res.sendStatus(400);
    }

    const date = new Date(invoiceDate);
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
