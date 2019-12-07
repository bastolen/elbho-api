import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  phoneNumber: { type: String },
  active: { type: Boolean, default: true },
  status: { type: String },
  location: { type: String },
  workArea: { type: String },
  region: { type: String },
  permissionLevel: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastPinged: { type: Date },
});

const Advisor = mongoose.model('Advisor', schema);
export { Advisor };
