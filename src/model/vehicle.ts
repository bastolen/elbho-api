import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    brand: { type: String },
    model: { type: String },
    location: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Vehicle = mongoose.model('Vehicle', schema);
export { Vehicle };
