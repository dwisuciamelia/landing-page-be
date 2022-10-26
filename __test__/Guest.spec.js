const request = require('supertest');
const app = require('../src/app');
const Guest = require('../src/guest/Guest');
const sequelize = require('../src/config/database');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return Guest.destroy({
    truncate: true,
  });
});

const validGuest = {
  name: 'guest1',
  major: 'major1',
  generation: '20xx',
  phone: '0812xxxxxxxx',
};

const postGuest = (guest = validGuest) => {
  return request(app).post('/api/landing/guests').send(guest);
};

describe('Add Guest', () => {
  it('returns 200 OK when add guest is valid', async () => {
    const response = await postGuest();
    expect(response.status).toBe(200);
  });

  it('returns success message when when add guest is valid', async () => {
    const response = await postGuest();
    expect(response.body.message).toBe('Guest Added');
  });

  it('save data guest to databases', async () => {
    await postGuest();
    const response = await Guest.findAll();
    expect(response.length).toBeGreaterThan(0);
  });

  it('returns error 400 when name is null', async () => {
    const response = await postGuest({
      major: 'major1',
      generation: '20xx',
      phone: '0812xxxxxxxx',
    });
    expect(response.status).toBe(400);
  });

  it('returns error 400 when major is null', async () => {
    const response = await postGuest({
      name: 'guest1',
      generation: '20xx',
      phone: '0812xxxxxxxx',
    });
    expect(response.status).toBe(400);
  });

  it('returns error 400 when generation is null', async () => {
    const response = await postGuest({
      name: 'guest1',
      major: 'major1',
      phone: '0812xxxxxxxx',
    });
    expect(response.status).toBe(400);
  });

  it('returns error 400 when phone is null', async () => {
    const response = await postGuest({
      name: 'guest1',
      major: 'major1',
      generation: '20xx',
    });
    expect(response.status).toBe(400);
  });

  it.each`
    field                   | value             | expectedMessage
    ${'name'}               | ${null}           | ${'Name cannot be null'}
    ${'major'}              | ${null}           | ${'Major cannot be null'}
    ${'generation'}         | ${null}           | ${'Generation cannot be null'}
    ${'phone'}              | ${null}           | ${'Phone cannot be null'}
  `(
    'returns $expectedMessage when $field is $value',
    async ({ field, value, expectedMessage }) => {
      const guest = {
        name: 'guest1',
        major: 'major1',
        generation: '20xx',
        phone: '0812xxxxxxxx',
      };
      guest[field] = value;
      const response = await postGuest(guest);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );

});
