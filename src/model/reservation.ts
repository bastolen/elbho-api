import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    date: { type: Date },
    start: { type: Date },
    end: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Reservation = mongoose.model('Reservation', schema);
export { Reservation };
