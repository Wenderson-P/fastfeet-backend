import request from 'supertest';
import app from '../../../src/app';

import truncate from '../../util/truncate';
import factory from '../../util/factories';

describe('Deliveryman', () => {
  beforeAll(async () => {
    await truncate();
  });

  it('should able to create a new deliveryman', async () => {
    const deliveryman = await factory.attrs('Deliveryman');
    const admin = await factory.attrs('Admin');

    await request(app)
      .post(`/users`)
      .send(admin);

    const adminResponse = await request(app)
      .post(`/sessions`)
      .send(admin);

    const response = await request(app)
      .set('Authorization', `Bearer ${adminResponse.body.token}`)
      .post(`/deliveryman`)
      .send(deliveryman);

    expect(response.body).toHaveProperty('id');
  });

  it('should able to list the deliveryMan', async () => {
    const deliveryman = await factory.attrs('Deliveryman');

    await request(app)
      .post(`/deliveryman`)
      .send(deliveryman);

    const response = await request(app).get(`/deliveryman`);

    expect(response.body).toHaveProperty('id');
  });
});
