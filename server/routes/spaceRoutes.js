const express = require('express');
const router = express.Router();
const {
  getMySpaces,
  createSpace,
  getSpace,
  updateSpace,
  deleteSpace,
} = require('../controllers/spaceController');
const { getSpaceTestimonials } = require('../controllers/testimonialController');
const { getSpaceAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getMySpaces)
  .post(upload.single('logo'), createSpace);

router.route('/:idOrSlug')
  .get(getSpace);

router.route('/:id')
  .put(upload.single('logo'), updateSpace)
  .delete(deleteSpace);

// Nested testimonial inbox & analytics routes
router.get('/:spaceId/testimonials', getSpaceTestimonials);
router.get('/:spaceId/analytics', getSpaceAnalytics);

module.exports = router;
