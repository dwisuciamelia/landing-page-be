const Guest = require('./Guest');

const save = async (body) => {
  // Store hash in your password DB.
  const guest = { ...body };
  await Guest.create(guest);
};

const take = async () => {
  const guest = await Guest.findAll({});
  if (guest) {
    return guest;
  }
  return false;
};

module.exports = { save, take };
