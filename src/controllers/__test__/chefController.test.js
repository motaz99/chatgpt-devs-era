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

    Chef.findOne.mockRejectedValue(new Error('An unexpected error occurred'));

    await chefControllers.createChef(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An unexpected error occurred',
    });
  });

  it('should handle authentication errors for missing req.cookies.jwt', async () => {
    const req = {
      body: {
        restaurant: 'Test Restaurant',
        location: 'Test Location',
        openingHours: '09:00 AM',
        closingHours: '06:00 PM',
        contactNumber: '1234567890',
        description: 'Test Description',
      },
      cookies: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    await chefControllers.createChef(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An unexpected error occurred',
    });
  });
});

describe('Chef Controller - getChefInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get the chef information and respond with status 200', async () => {
    const req = {
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    const mockChef = {
      _id: 'mocked-chef-id',
      restaurant: 'Test Restaurant',
      location: 'Test Location',
      openingHours: '09:00 AM',
      closingHours: '06:00 PM',
      contactNumber: '1234567890',
      description: 'Test Description',
    };
    Chef.findOne.mockResolvedValue(mockChef);

    await chefControllers.getChefInfo(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Chef information page',
      data: mockChef,
    });
  });

  it('should handle errors and send a 500 status with error message', async () => {
    const req = {
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    const errorMessage = 'An unexpected error occurred';
    Chef.findOne.mockRejectedValue(new Error(errorMessage));

    await chefControllers.getChefInfo(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      message: errorMessage,
    });
  });

  it('should handle authentication errors for missing req.cookies.jwt', async () => {
    const req = {
      cookies: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    await chefControllers.getChefInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      message: 'An unexpected error occurred',
    });
  });
});

describe('editChefInfo', () => {
  it('should update the chef info and return the updated chef object', async () => {
    const req = {
      body: {
        restaurant: 'Updated Restaurant',
        location: 'Updated Location',
        openingHours: '09:00 AM',
        closingHours: '06:00 PM',
        contactNumber: '9876543210',
        description: 'Updated Description',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockChef = {
      id: 'mocked-chef-id',
      userId: 'mocked-user-id',
      restaurant: 'Test Restaurant',
      location: 'Test Location',
      openingHours: '09:00 AM',
      closingHours: '06:00 PM',
      contactNumber: '1234567890',
      description: 'Test Description',
    };

    Chef.findOneAndUpdate.mockResolvedValue(mockChef);

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    await chefControllers.editChefInfo(req, res);

    expect(Chef.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'mocked-user-id' },
      req.body,
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Chef object got updated',
      data: mockChef,
    });
  });

  it('should handle errors and send a 500 status with error message', async () => {
    const req = {
      body: {
        restaurant: 'Updated Restaurant',
        location: 'Updated Location',
        openingHours: '09:00 AM',
        closingHours: '06:00 PM',
        contactNumber: '9876543210',
        description: 'Updated Description',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Chef.findOneAndUpdate.mockRejectedValue(
      new Error('An unexpected error occurred')
    );

    decodeJwtToken.mockReturnValue({ userId: 'mocked-user-id' });

    await chefControllers.editChefInfo(req, res);

    expect(Chef.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'mocked-user-id' },
      req.body,
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An unexpected error occurred',
    });
  });
});
