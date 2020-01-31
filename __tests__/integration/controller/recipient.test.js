import request from 'supertest';
import app from '../../../src/app';

import truncate from '../../util/truncate';
import factory from '../../util/factories';

describe('Recipient', () => {
  beforeAll(async () => {
    await truncate();
  });

  it('should not be able to complete the request without name', async () => {
    const recipient = await factory.attrs('Recipient');

    recipient.name = '';

    const response = await request(app)
      .post(`/recipient`)
      .send(recipient);

    expect(response.status).toBe(401);
  });
});
