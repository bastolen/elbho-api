import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    fileName: { type: String },
    date: { type: Date, default: Date.now },
    filePath: { type: String },
    invoiceMonth: { type: Date }
  },
  {
    timestamps: true
  }
);

const Invoice = mongoose.model('Invoice', schema);
export { Invoice };
