import request from 'supertest';

import bcrypt from 'bcryptjs';

import app from '../../../src/app';
import User from '../../../src/app/models/User';

import truncate from '../../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post(`/users`)
      .send({
        name: 'Wenderson Pac',
        email: 'wps713@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should encrypt user password when new user created', async () => {
    const user = await User.create({
      name: 'Wenderson Pac',
      email: 'wps713@gmail.com',
      password: '123456',
    });
    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
