export const PUBLIC_REGISTRATION_ROLE = 'CUSTOMER';

export function getJwtSecret(env = globalThis.process?.env ?? {}) {
  const secret = env.JWT_SECRET;

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new Error('JWT_SECRET must be configured before the server starts.');
  }
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long.');
  }

  return secret;
}
