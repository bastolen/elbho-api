import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    licensePlate: { type: String },
    brand: { type: String },
    model: { type: String },
    location: { type: String }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model('Vehicle', schema);
export { Vehicle };
