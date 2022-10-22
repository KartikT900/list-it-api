import getAllUsers from './sample.service';

import { prismaMock } from '../../setupTest';

describe('sample.service', () => {
  it('runs successfully', async () => {
    const users = [
      {
        user_id: '2321rf32fvvvr23232',
        email: 'test123@test.com',
        name: 'test123',
        password: 'ffefefef',
        nickname: ''
      }
    ];

    prismaMock.users.findMany.mockResolvedValue(users);

    const result = await getAllUsers();

    expect(result).toEqual(users);
  });
});
