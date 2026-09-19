const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a Space name'],
      trim: true,
      maxlength: [60, 'Space name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a unique slug'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'],
    },
    logoUrl: {
      type: String,
      default: '',
    },
    headerTitle: {
      type: String,
      default: 'Share your feedback with us!',
    },
    customMessage: {
      type: String,
      default: 'We would love to hear your thoughts and experience with our service. It takes less than 60 seconds.',
    },
    questions: {
      type: [String],
      default: [
        'What specific feature or benefit do you like most?',
        'How has this product/service made a difference for you?',
        'Would you recommend us to colleagues or friends?',
      ],
    },
    settings: {
      collectStarRating: {
        type: Boolean,
        default: true,
      },
      mandatoryAvatar: {
        type: Boolean,
        default: false,
      },
      thankYouTitle: {
        type: String,
        default: 'Thank you so much! 🎉',
      },
      thankYouMessage: {
        type: String,
        default: 'Your testimonial has been submitted and means the world to our team.',
      },
      redirectUrl: {
        type: String,
        default: '',
      },
      accentColor: {
        type: String,
        default: '#16a34a',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Space', spaceSchema);
