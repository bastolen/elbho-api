import * as async from 'async';
import * as axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { Invoice } from '../model';


class InvoiceService {
  static addInvoice(advisorId, date, fileName, file, cb) {
    let newId;
    let newUrl;

    async.waterfall([
      callback => {
        const invoice = new Invoice({
          advisorId,
          fileName,
          filePath: 'Not yet saved',
          invoiceMonth: date
        });
        invoice.save(callback);
      },
      (invoice, callback) => {
        newId = invoice._id;
        const form = new FormData();

        const fileExtension = path.extname(file.originalname).split('.')[1];
        form.append('file', fs.createReadStream(file.path), { filename: `${newId}.${fileExtension}` });
        const headers = form.getHeaders();

        const APIKEY = process.env.APIKEY || '';
        headers['api-key'] = APIKEY;
        axios.default.create({
          headers
        }).post('https://api.bastolen.nl/elbho/fileUpload.php', form).then(response => {
          const jsonResult = response.data;
          if (jsonResult.error) {
            return Invoice.findByIdAndDelete(newId, callback);
          }
          return callback(null, jsonResult.url)
        }).catch(error => {
          return callback(error);
        });
      },
      (url, callback) => {
        if (typeof url === 'object') {
          return callback('file not saved');
        }
        newUrl = url;
        fs.unlink(file.path, callback);
      },
      callback => Invoice.findByIdAndUpdate(newId, { filePath: newUrl }, { new: true }, callback)

    ], cb)
  }

  static getInvoicesForAdvisor(advisorId, callback) {
    Invoice.find(advisorId, callback).lean()
  }
}

export { InvoiceService };
