import { isTokenExpire, makeLogin } from './login';

import {
  generateTokenWithTimeRange,
  generateTokenWithExpirationAsString,
  generateTokenWithOutExpiration,
  generateInvalidToken,
} from '../../jest/unit/components/__mocks__/token';
/* eslint-disable no-console */
console.error = jest.fn();

jest.mock('./api', () => ({
  request: require('../../jest/unit/components/__mocks__/api').default.request,
}));

describe('isTokenExpire', (): void => {
  test('isTokenExpire - token is not a valid payload', (): void => {
    expect(isTokenExpire('not_a_valid_token')).toBeTruthy();
  });

  test('isTokenExpire - token should not expire in 24 hrs range', (): void => {
    const token = generateTokenWithTimeRange(24);
    expect(isTokenExpire(token)).toBeFalsy();
  });

  test('isTokenExpire - token should expire for current time', (): void => {
    const token = generateTokenWithTimeRange();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  test('isTokenExpire - token expiration is not available', (): void => {
    const token = generateTokenWithOutExpiration();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  test('isTokenExpire - token is not a valid json token', (): void => {
    const token = generateInvalidToken();
    const result = ['Invalid token:', new SyntaxError('Unexpected token i in JSON at position 0'), 'xxxxxx.aW52YWxpZHRva2Vu.xxxxxx'];
    expect(isTokenExpire(token)).toBeTruthy();
    expect(console.error).toHaveBeenCalledWith(...result);
  });

  test('isTokenExpire - token expiration is not a number', (): void => {
    const token = generateTokenWithExpirationAsString();
    expect(isTokenExpire(token)).toBeTruthy();
  });
});

describe('makeLogin', (): void => {
  test('makeLogin - should give error for blank username and password', async (): Promise<void> => {
    const result = {
      error: {
        description: "Username or password can't be empty!",
        title: 'Unable to login',
        type: 'error',
      },
    };
    const login = await makeLogin();
    expect(login).toEqual(result);
  });

  test('makeLogin - should login successfully', async (): Promise<void> => {
    const { username, password } = { username: 'sam', password: '1234' };
    const result = { token: 'TEST_TOKEN', username: 'sam' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });

  test('makeLogin - login should failed with 401', async () => {
    const result = {
      error: {
        description: 'bad username/password, access denied',
        title: 'Unable to login',
        type: 'error',
      },
    };

    const { username, password } = { username: 'sam', password: '123456' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });

  test('makeLogin - login should failed with when no data is sent', async () => {
    const result = {
      error: {
        title: 'Unable to login',
        type: 'error',
        description: "Username or password can't be empty!",
      },
    };

    const { username, password } = { username: '', password: '' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });
});
