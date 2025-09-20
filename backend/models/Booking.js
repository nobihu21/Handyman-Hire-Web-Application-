const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  handymanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Handyman',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['electrician', 'plumber']
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  additionalNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 