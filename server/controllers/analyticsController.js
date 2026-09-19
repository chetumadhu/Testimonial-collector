const Testimonial = require('../models/Testimonial');
const Space = require('../models/Space');

// @desc    Get rating metrics and summary statistics for a space
// @route   GET /api/spaces/:spaceId/analytics
exports.getSpaceAnalytics = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findOne({ _id: spaceId, owner: req.user._id });
    if (!space) {
      return res.status(403).json({ success: false, message: 'Unauthorized or space not found' });
    }

    const totalReviews = await Testimonial.countDocuments({ spaceId });
    const approvedReviews = await Testimonial.countDocuments({ spaceId, status: 'approved' });
    const pendingReviews = await Testimonial.countDocuments({ spaceId, status: 'pending' });
    const archivedReviews = await Testimonial.countDocuments({ spaceId, status: 'archived' });
    const featuredReviews = await Testimonial.countDocuments({ spaceId, isFeatured: true });

    // Aggregate rating breakdown for approved reviews
    const distributionAgg = await Testimonial.aggregate([
      { $match: { spaceId: space._id, status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRatings = 0;

    distributionAgg.forEach((item) => {
      if (item._id >= 1 && item._id <= 5) {
        distribution[item._id] = item.count;
        sumRatings += item._id * item.count;
      }
    });

    const avgRating = approvedReviews > 0 ? parseFloat((sumRatings / approvedReviews).toFixed(1)) : 5.0;

    // Percentages
    const distributionPercentages = {};
    for (let star = 1; star <= 5; star++) {
      distributionPercentages[star] =
        approvedReviews > 0 ? Math.round((distribution[star] / approvedReviews) * 100) : 0;
    }

    // Recommendation score (% with 4 or 5 stars)
    const positiveCount = (distribution[5] || 0) + (distribution[4] || 0);
    const recommendationRate = approvedReviews > 0 ? Math.round((positiveCount / approvedReviews) * 100) : 100;

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        archivedReviews,
        featuredReviews,
        avgRating,
        recommendationRate,
        distribution,
        distributionPercentages,
      },
    });
  } catch (error) {
    next(error);
  }
};
