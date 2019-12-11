import * as mongoose from 'mongoose';
import { InvoiceService } from "../service";

class InvoiceController {
  static addInvoice(req, res) {
    if (!req.body || !req.file || !req.body.date) {
      return res.sendStatus(400);
    }

    const { file } = req;
    const fileName = file.originalname;
    const invoiceDate = req.body.date
    const advisorId = req.advisor._id

    if (new Date(invoiceDate).toString() === 'Invalid Date') {
      return res.sendStatus(400);
    }

    InvoiceService.addInvoice(advisorId, new Date(invoiceDate), fileName, file, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).send(result);
    })
  }

  static getInvoiceForAdvisor(req, res) {
    let advisor: string;
    if (req.params.id !== 'me' && req.advisor.permissionLevel > 1) {
      advisor = req.params.id;
    } else if (req.params.id !== 'me' && req.advisor.permissionLevel <= 1) {
      return res.sendStatus(403);
    } else {
      advisor = req.advisor._id;
    }

    if (!mongoose.Types.ObjectId.isValid(advisor)) {
      res.sendStatus(400);
    }

    InvoiceService.getInvoicesForAdvisor(advisor, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(result);
    })
  }
}

export { InvoiceController };
