import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    fileName: { type: String },
    date: { type: Date, default: Date.now },
    filePath: { type: String },
    invoiceMonth: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Invoice = mongoose.model('Invoice', schema);
export { Invoice };
