import { InvoiceService } from "../service";

class InvoiceController {
  static addInvoice(req, res) {
    if (!req.file || !req.body.date) {
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
    const advisorId = req.params.id === 'me' ? req.advisor._id : req.params.id;
    InvoiceService.getInvoicesForAdvisor({ advisorId }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(result);
    })
  }
}

export { InvoiceController };
