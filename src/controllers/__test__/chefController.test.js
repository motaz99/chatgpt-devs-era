const chefControllers = require('../chefController');
const Chef = require('../../models/chef');
const decodeJwtToken = require('../../helpers/decodeJwtToken');

jest.mock('../../models/chef');
jest.mock('../../helpers/decodeJwtToken');

afterEach(() => {
  jest.clearAllMocks();
});

describe('createChef', () => {
  it('should create a new chef and return a 201 status with a message', async () => {
    const req = {
      body: {
        restaurant: 'Test Restaurant',
        location: 'Test Location',
        openingHours: '09:00 AM',
        closingHours: '06:00 PM',
        contactNumber: '1234567890',
        description: 'Test Description',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    Chef.findOne.mockResolvedValue(null);
    Chef.create.mockResolvedValue({});

    await chefControllers.createChef(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(Chef.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.redirect).toHaveBeenCalledWith('/api/chef/me');
  });

  it('should handle the case when the chef already exists', async () => {
    const req = {
      body: {
        restaurant: 'Test Restaurant',
        location: 'Test Location',
        openingHours: '09:00 AM',
        closingHours: '06:00 PM',
        contactNumber: '1234567890',
        description: 'Test Description',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    const existingChef = {
      _id: 'existing_chef_id',
      userId: 'mocked-user-id',
      restaurant: 'Existing Restaurant',
      location: 'Existing Location',
      openingHours: '09:00 AM',
      closingHours: '06:00 PM',
      contactNumber: '1234567890',
      description: 'Existing Description',
    };
    Chef.findOne.mockResolvedValue(existingChef);

    await chefControllers.createChef(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(Chef.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Chef already exists.' });
  });

  it('should handle errors and send a 500 status with error message', async () => {
    // I need to add test case here
  });
});
