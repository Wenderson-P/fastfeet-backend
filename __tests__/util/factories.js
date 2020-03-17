import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/models/User';
import Recipient from '../../src/app/models/Recipient';
import Deliveryman from '../../src/app/models/Deliveryman';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Admin', User, {
  name: 'admin',
  email: 'admin@fastfeet.com',
  password: '123456',
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

factory.define('Deliveryman', Deliveryman, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
});
export default factory;
