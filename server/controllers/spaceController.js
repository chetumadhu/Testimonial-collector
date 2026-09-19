const Space = require('../models/Space');
const Testimonial = require('../models/Testimonial');

// @desc    Get all spaces owned by logged-in user with review counts
// @route   GET /api/spaces
exports.getMySpaces = async (req, res, next) => {
  try {
    const spaces = await Space.find({ owner: req.user._id }).sort({ createdAt: -1 });

    // Attach testimonial counts and average rating for each space
    const spacesWithStats = await Promise.all(
      spaces.map(async (space) => {
        const totalReviews = await Testimonial.countDocuments({ spaceId: space._id });
        const pendingReviews = await Testimonial.countDocuments({ spaceId: space._id, status: 'pending' });
        const approvedReviews = await Testimonial.countDocuments({ spaceId: space._id, status: 'approved' });

        const ratingsAgg = await Testimonial.aggregate([
          { $match: { spaceId: space._id, status: 'approved' } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);

        const avgRating = ratingsAgg.length > 0 ? parseFloat(ratingsAgg[0].avgRating.toFixed(1)) : 5.0;

        return {
          ...space.toObject(),
          stats: {
            total: totalReviews,
            pending: pendingReviews,
            approved: approvedReviews,
            avgRating,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: spacesWithStats.length,
      data: spacesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new space
// @route   POST /api/spaces
exports.createSpace = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      headerTitle,
      customMessage,
      questions,
      settings,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Space name and unique slug are required' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await Space.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: `The slug '${cleanSlug}' is already taken. Please choose another.` });
    }

    let logoUrl = req.body.logoUrl || '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }

    let parsedQuestions = questions;
    if (typeof questions === 'string') {
      try {
        parsedQuestions = JSON.parse(questions);
      } catch (e) {
        parsedQuestions = [questions];
      }
    }

    let parsedSettings = settings;
    if (typeof settings === 'string') {
      try {
        parsedSettings = JSON.parse(settings);
      } catch (e) {
        parsedSettings = {};
      }
    }

    const space = await Space.create({
      owner: req.user._id,
      name,
      slug: cleanSlug,
      logoUrl,
      headerTitle: headerTitle || `Share your review with ${name}`,
      customMessage: customMessage || 'Your feedback helps us continuously build better products and experiences.',
      questions: parsedQuestions || [
        'What specific feature or benefit do you like most?',
        'How has this product/service made a difference for you?',
        'Would you recommend us to colleagues or friends?',
      ],
      settings: {
        collectStarRating: parsedSettings?.collectStarRating ?? true,
        mandatoryAvatar: parsedSettings?.mandatoryAvatar ?? false,
        thankYouTitle: parsedSettings?.thankYouTitle || 'Thank you so much! 🎉',
        thankYouMessage: parsedSettings?.thankYouMessage || 'Your testimonial has been submitted successfully.',
        redirectUrl: parsedSettings?.redirectUrl || '',
        accentColor: parsedSettings?.accentColor || '#16a34a',
      },
    });

    res.status(201).json({
      success: true,
      data: space,
      message: 'Space created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get space by ID or slug (owner only)
// @route   GET /api/spaces/:idOrSlug
exports.getSpace = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let space;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      space = await Space.findOne({ _id: idOrSlug, owner: req.user._id });
    } else {
      space = await Space.findOne({ slug: idOrSlug, owner: req.user._id });
    }

    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: space });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a space
// @route   PUT /api/spaces/:id
exports.updateSpace = async (req, res, next) => {
  try {
    const space = await Space.findOne({ _id: req.params.id, owner: req.user._id });
    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found or unauthorized' });
    }

    if (req.file) {
      req.body.logoUrl = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.questions === 'string') {
      try {
        req.body.questions = JSON.parse(req.body.questions);
      } catch (e) {}
    }

    if (typeof req.body.settings === 'string') {
      try {
        req.body.settings = JSON.parse(req.body.settings);
      } catch (e) {}
    }

    const updatedSpace = await Space.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedSpace,
      message: 'Space updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a space and all its testimonials
// @route   DELETE /api/spaces/:id
exports.deleteSpace = async (req, res, next) => {
  try {
    const space = await Space.findOne({ _id: req.params.id, owner: req.user._id });
    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found or unauthorized' });
    }

    await Testimonial.deleteMany({ spaceId: space._id });
    await Space.findByIdAndDelete(space._id);

    res.status(200).json({
      success: true,
      message: 'Space and associated testimonials deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
