const bcrypt = require('bcrypt');
const User = require('../../models/User');
const auth = require('../authController');

describe('login', () => {
  const user = {
    email: 'test@test.com',
    password: 'password',
  };

  it('should login a user with valid credentials', async () => {
    const req = {
      body: {
        email: user.email,
        password: user.password,
      },
      cookies: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
    };

    // Mock the User.findOne and bcrypt.compare functions
    User.findOne = jest.fn().mockResolvedValue({
      email: user.email,
      password: await bcrypt.hash('password', 10),
      role: 'client',
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await auth.login(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith('jwt', expect.any(String), {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/api/clients/chefs');
  });

  it('should not login a user with invalid credentials', async () => {
    const req = {
      body: {
        email: user.email,
        password: 'wrong-password',
      },
      cookies: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue({
      email: user.email,
      password: await bcrypt.hash('password', 10),
    });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await auth.login(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid email or password',
    });
  });
});
