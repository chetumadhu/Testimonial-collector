const express = require('express');
const router = express.Router();
const {
  getPublicSpace,
  submitTestimonial,
  getPublicWall,
} = require('../controllers/publicController');
const upload = require('../middleware/upload');

router.get('/space/:slug', getPublicSpace);
router.post('/space/:slug/testimonials', upload.single('avatar'), submitTestimonial);
router.get('/space/:slug/wall', getPublicWall);

module.exports = router;
