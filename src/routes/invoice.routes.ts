import * as express from 'express';
import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';
import { InvoiceController } from '../controller';

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).split('.')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${fileExtension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|pdf|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      `Error: File upload only supports the following filetypes - ${filetypes}`
    );
  },
});

app.post('', upload.single('file'), InvoiceController.addInvoice);
app.get('/:advisorId', InvoiceController.getInvoiceForAdvisor);

export default app;
