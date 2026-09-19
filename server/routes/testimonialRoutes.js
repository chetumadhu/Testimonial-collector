const express = require('express');
const router = express.Router();
const {
  updateStatus,
  toggleFeature,
  toggleLike,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.patch('/:id/status', updateStatus);
router.patch('/:id/feature', toggleFeature);
router.patch('/:id/like', toggleLike);
router.delete('/:id', deleteTestimonial);

module.exports = router;
