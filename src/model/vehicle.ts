import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    brand: { type: String },
    transmission: { type: String, default: 'Automaat' },
    model: { type: String },
    location: { type: String },
    city: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Vehicle = mongoose.model('Vehicle', schema);
export { Vehicle };
