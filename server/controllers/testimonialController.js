const Testimonial = require('../models/Testimonial');
const Space = require('../models/Space');

// Helper to verify user owns the space for this testimonial
const verifyOwnership = async (spaceId, userId) => {
  return await Space.findOne({ _id: spaceId, owner: userId });
};

// @desc    Get testimonials for a space with status, rating, and keyword search filters
// @route   GET /api/spaces/:spaceId/testimonials
exports.getSpaceTestimonials = async (req, res, next) => {
  try {
    const { spaceId } = req.params;
    const { status, rating, search, featured, sort } = req.query;

    const space = await verifyOwnership(spaceId, req.user._id);
    if (!space) {
      return res.status(403).json({ success: false, message: 'Not authorized for this space' });
    }

    const query = { spaceId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (rating && !isNaN(rating)) {
      query.rating = Number(rating);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { companyRole: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { submittedAt: -1 };
    if (sort === 'rating-desc') sortOption = { rating: -1, submittedAt: -1 };
    if (sort === 'rating-asc') sortOption = { rating: 1, submittedAt: -1 };
    if (sort === 'oldest') sortOption = { submittedAt: 1 };

    const testimonials = await Testimonial.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    One-click update testimonial status (pending, approved, archived)
// @route   PATCH /api/testimonials/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const space = await verifyOwnership(testimonial.spaceId, req.user._id);
    if (!space) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    testimonial.status = status;
    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
      message: `Testimonial marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/testimonials/:id/feature
exports.toggleFeature = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const space = await verifyOwnership(testimonial.spaceId, req.user._id);
    if (!space) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
      message: testimonial.isFeatured ? 'Pinned to Featured' : 'Removed from Featured',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle liked status
// @route   PATCH /api/testimonials/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const space = await verifyOwnership(testimonial.spaceId, req.user._id);
    if (!space) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    testimonial.isLiked = !testimonial.isLiked;
    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
      message: testimonial.isLiked ? 'Marked as Liked' : 'Unliked',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const space = await verifyOwnership(testimonial.spaceId, req.user._id);
    if (!space) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
