const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clockIn: {
      type: Date,
      required: true,
    },
    clockOut: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// La consulta más frecuente es "fichajes de este usuario en esta empresa,
// ordenados por fecha" -> índice compuesto para que escale con el volumen de datos.
timeEntrySchema.index({ companyId: 1, userId: 1, clockIn: -1 });

timeEntrySchema.virtual('durationMinutes').get(function durationMinutes() {
  if (!this.clockOut) return null;
  return Math.round((this.clockOut - this.clockIn) / 60000);
});

timeEntrySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
