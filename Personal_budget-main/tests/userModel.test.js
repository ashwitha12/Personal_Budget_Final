

const mongoose = require('mongoose');
const User = require('../models/user'); 

describe('User Model', () => {
  beforeAll(async () => {
   
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
   
    await mongoose.connection.close();
  });

  test('should hash the password before saving', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'testpassword',
    };

    const newUser = new User(userData);
    await newUser.save();

    expect(newUser.password).not.toBe(userData.password);
  });

  test('should compare passwords correctly', async () => {
    const userData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'janesmith@example.com',
      password: 'testpassword',
    };

    const newUser = new User(userData);
    await newUser.save();

    const isMatch = await newUser.comparePassword('testpassword');
    expect(isMatch).toBe(true);

    const isNotMatch = await newUser.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});