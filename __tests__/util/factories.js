import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/models/User';
import Recipient from '../../src/app/models/Recipient';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Recipient', Recipient, {
  name: faker.name.findName(),
  street: faker.address.streetName(),
  number: 578,
  complement: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  cep: 64000000,
});

export default factory;
