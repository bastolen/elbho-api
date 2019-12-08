import { Invoice } from '../model';

class InvoiceService {
  static addInvoice(advisorId, date, fileName, file, callback) {
    // TODO: Handle the file
    const invoice = new Invoice({
      advisorId,
      fileName,
      filePath: 'Not yet saved',
      invoiceMonth: date
    });

    invoice.save(callback);
  }

  static getInvoicesForAdvisor(advisorId, callback) {
    Invoice.find(advisorId, callback).lean()
  }
}

export { InvoiceService };
