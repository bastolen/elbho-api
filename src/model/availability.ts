import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    date: { type: Date },
    start: { type: Date },
    end: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Availability = mongoose.model('Availability', schema);
export { Availability };
