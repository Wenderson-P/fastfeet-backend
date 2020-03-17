import request from 'supertest';
import app from '../../../src/app';

import truncate from '../../util/truncate';
import factory from '../../util/factories';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able to complete the request without password', async () => {
    const user = await factory.attrs('User');

    user.password = '';

    const response = await request(app)
      .post(`/sessions`)
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to complete the request without email', async () => {
    const user = await factory.attrs('User');

    user.email = '';

    const response = await request(app)
      .post(`/sessions`)
      .send(user);

    expect(response.status).toBe(400);
  });

  // it('should register and make user login', async () => {
  //   const user = await factory.attrs('Admin');

  //   await request(app)
  //     .post(`/users`)
  //     .send(user);

  //   const response = await request(app)
  //     .post(`/sessions`)
  //     .send(user);

  //   expect(response.body).toHaveProperty('token');
  // });
});
