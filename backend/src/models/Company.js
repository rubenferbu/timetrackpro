const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la empresa es obligatorio'],
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    settings: {
      annualVacationDays: { type: Number, default: 22 },
      workHoursPerDay: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
