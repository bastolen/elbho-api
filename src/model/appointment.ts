import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    startTime: { type: Date },
    endTime: { type: Date },
    comment: { type: String },
    address: { type: String },
    contactPersonName: { type: String },
    contactPersonPhoneNumber: { type: String },
    contactPersonFunction: { type: String },
    contactPersonEmail: { type: String },
    active: { type: Boolean },
    website: { type: String },
    logo: { type: String },
    cocNumber: { type: String },
    cocName: { type: String },
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', schema);
export { Appointment };
