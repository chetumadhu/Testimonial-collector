const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
      maxlength: [60, 'Client name cannot exceed 60 characters'],
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
    },
    companyRole: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Company or role cannot exceed 100 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide testimonial review text'],
      trim: true,
      maxlength: [2000, 'Testimonial text cannot exceed 2000 characters'],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'archived'],
      default: 'pending',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ spaceId: 1, status: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
