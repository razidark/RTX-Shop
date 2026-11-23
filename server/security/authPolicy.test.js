import assert from 'node:assert/strict';
import test from 'node:test';
import { getJwtSecret, PUBLIC_REGISTRATION_ROLE } from './authPolicy.js';

test('getJwtSecret accepts a configured secret of at least 32 characters', () => {
  const secret = 'x'.repeat(32);
  assert.equal(getJwtSecret({ JWT_SECRET: secret }), secret);
});

test('getJwtSecret rejects a missing secret', () => {
  assert.throws(() => getJwtSecret({}), /JWT_SECRET must be configured/);
});

test('getJwtSecret rejects a weak secret', () => {
  assert.throws(() => getJwtSecret({ JWT_SECRET: 'short' }), /at least 32 characters/);
});

test('public registration never grants admin privileges', () => {
  assert.equal(PUBLIC_REGISTRATION_ROLE, 'CUSTOMER');
});
