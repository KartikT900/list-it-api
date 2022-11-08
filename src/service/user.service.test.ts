import getUserById from './user.service';

import { prismaMock } from '../../setupTest';

describe('sample.service', () => {
  it('runs successfully', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      user_id: 'id123'
    };

    prismaMock.users.findUnique.mockResolvedValue(user);

    const result = await getUserById(user.user_id);

    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('nickname');
    expect(result).toHaveProperty('user_id');
    expect(result).not.toHaveProperty('password');
  });
});
