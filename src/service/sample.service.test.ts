import getAllUsersCount from './sample.service';

import { prismaMock } from '../../setupTest';

describe('sample.service', () => {
  it('runs successfully', async () => {
    const users = 1;

    prismaMock.users.count.mockResolvedValue(users);

    const result = await getAllUsersCount();

    expect(result).toEqual(users);
  });
});
