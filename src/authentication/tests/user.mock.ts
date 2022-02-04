import User from '../../users/user.entity';
import mockdate from 'mockdate';

mockdate.set('2000-11-22');

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'something',
  password: 'hash',
  stripeCustomerId: 'stripe_customer_id',
  createdAt: new Date(),
  updatedAt: new Date(),
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
  isTwoFactorAuthenticationEnabled: false
};

export default mockedUser;
