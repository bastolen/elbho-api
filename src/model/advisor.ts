import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    phoneNumber: { type: String },
    active: { type: Boolean, default: true },
    status: { type: String },
    location: { type: String, default: 'unknown, unknown' },
    workArea: { type: String },
    region: { type: String },
    permissionLevel: { type: Number, default: 1 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastPinged: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Advisor = mongoose.model('Advisor', schema);
export { Advisor };
