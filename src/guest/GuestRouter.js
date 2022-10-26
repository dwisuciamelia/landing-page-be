const express = require('express');
const GuestService = require('./GuestService');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/api/landing/guests',
  check('name').notEmpty().withMessage('Name cannot be null'),
  check('major').notEmpty().withMessage('Major cannot be null'),
  check('generation').notEmpty().withMessage('Generation cannot be null'),
  check('phone').notEmpty().withMessage('Phone cannot be null'),
  check('email')
    .notEmpty()
    .withMessage('Email cannot be null')
    .bail()
    .isEmail()
    .withMessage('Email must be valid'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.param] = error.msg));
      return res.status(400).send({ validationErrors });
    }
    await GuestService.save(req.body);
    return res.send({ message: 'Guest Added' });
  }
);

router.get('/api/landing/guests', async (req, res) => {
  const guest = await GuestService.take();
  res.send({ message: 'Get List Guest Success', data: guest });
});

module.exports = router;
