import User from '../../users/user.entity';
import mockdate from 'mockdate';

mockdate.set('2000-11-22');

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  password: 'hash',
  createdAt: new Date(),
  updatedAt: new Date(),
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
};

export default mockedUser;
