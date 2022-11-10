import getUserById from './user.service';

import { prismaMock } from '../../setupTest';

describe('user.service', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1668066360344);
  });

  it('runs successfully', async () => {
    const user = {
      id: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      name: 'test',
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      user_id: 'id123'
    };

    prismaMock.user.findUnique.mockResolvedValue({ ...user });

    const result = await getUserById(user.user_id);

    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('nickname');
    expect(result).toHaveProperty('user_id');
    expect(result).toHaveProperty('updatedAt');
    expect(result).toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('password');
    expect(result).not.toEqual(user);
  });
});
