import * as mongoose from 'mongoose';

const advisors = new mongoose.Schema(
  {
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    accepted: { type: Boolean, default: false },
    responded: { type: Boolean, default: false },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    accepted: { type: Boolean, default: false },
    currentAdvisorIndex: { type: Number, default: 0 },
    currentAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    advisors: [advisors],
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', schema);
export { Request };
