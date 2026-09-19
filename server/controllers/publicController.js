const Space = require('../models/Space');
const Testimonial = require('../models/Testimonial');

// @desc    Get public space configuration for submission form
// @route   GET /api/public/space/:slug
exports.getPublicSpace = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const space = await Space.findOne({ slug });

    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: space._id,
        name: space.name,
        slug: space.slug,
        logoUrl: space.logoUrl,
        headerTitle: space.headerTitle,
        customMessage: space.customMessage,
        questions: space.questions,
        settings: space.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Public frictionless submission of a testimonial (No Login Required)
// @route   POST /api/public/space/:slug/testimonials
exports.submitTestimonial = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const space = await Space.findOne({ slug });

    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found' });
    }

    const { clientName, clientEmail, companyRole, rating, reviewText } = req.body;

    // Validate required fields
    if (!clientName || !clientEmail || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide client name, email, and your review.',
      });
    }

    let avatarUrl = req.body.avatarUrl || '';
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    // Check mandatory avatar setting
    if (space.settings.mandatoryAvatar && !avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'An avatar or photo is required by the space owner.',
      });
    }

    let parsedRating = 5;
    if (space.settings.collectStarRating) {
      parsedRating = Number(rating) || 5;
      if (parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
    }

    const testimonial = await Testimonial.create({
      spaceId: space._id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      companyRole: companyRole ? companyRole.trim() : '',
      rating: parsedRating,
      reviewText: reviewText.trim(),
      avatarUrl,
      status: 'pending', // Starts in pending for owner moderation
    });

    res.status(201).json({
      success: true,
      message: space.settings.thankYouMessage || 'Thank you for your feedback!',
      thankYouTitle: space.settings.thankYouTitle || 'Thank you so much! 🎉',
      redirectUrl: space.settings.redirectUrl || '',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved testimonials for public Wall of Love
// @route   GET /api/public/space/:slug/wall
exports.getPublicWall = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rating, featured } = req.query;

    const space = await Space.findOne({ slug });
    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found' });
    }

    const query = {
      spaceId: space._id,
      status: 'approved',
    };

    if (rating && !isNaN(rating)) {
      query.rating = Number(rating);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Pinned / featured testimonials appear first, then newest
    const testimonials = await Testimonial.find(query).sort({ isFeatured: -1, submittedAt: -1 });

    // Summary calculations
    const totalApproved = testimonials.length;
    const avgRating =
      totalApproved > 0
        ? parseFloat((testimonials.reduce((acc, t) => acc + t.rating, 0) / totalApproved).toFixed(1))
        : 5.0;

    res.status(200).json({
      success: true,
      space: {
        id: space._id,
        name: space.name,
        slug: space.slug,
        logoUrl: space.logoUrl,
        headerTitle: space.headerTitle,
        settings: space.settings,
      },
      stats: {
        totalReviews: totalApproved,
        avgRating,
      },
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};
