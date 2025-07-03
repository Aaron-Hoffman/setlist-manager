import getUser from './getUser';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('./auth', () => ({
  authOptions: { provider: 'mock' },
}));

describe('getUser', () => {
  it('returns the session from getServerSession', async () => {
    const fakeSession = { user: { name: 'Test User', email: 'test@example.com' } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(fakeSession);
    const result = await getUser();
    expect(result).toBe(fakeSession);
  });

  it('calls getServerSession with authOptions', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    await getUser();
    expect(getServerSession).toHaveBeenCalledWith(authOptions);
  });
}); 