import * as express from 'express';
import * as multer from 'multer';
import { InvoiceController } from '../controller';

const app = express();
const storage = multer();

app.post('', storage.single('file'), InvoiceController.addInvoice)
app.get('/:id', InvoiceController.getInvoiceForAdvisor)

export default app;
