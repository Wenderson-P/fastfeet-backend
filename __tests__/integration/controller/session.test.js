import request from 'supertest';
import app from '../../../src/app';

import truncate from '../../util/truncate';
import factory from '../../util/factories';

describe('User', () => {
  beforeAll(async () => {
    await truncate();
  });

  it('should register and make user login', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post(`/users`)
      .send(user);

    const response = await request(app)
      .post(`/sessions`)
      .send(user);

    expect(response.body).toHaveProperty('user');
  });
});
