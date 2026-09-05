import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET no está definido en producción. Configúralo en Vercel.');
  }
  return 'celstore-dev-secret-change-me';
}

function hashKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

export function signToken(payload, secret = getSecret(), expiresInHours = 24) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, hashKey(secret), iv);

  const content = JSON.stringify({
    ...payload,
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
  });

  const encrypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

export function verifyToken(token, secret = getSecret()) {
  try {
    const [ivB64, tagB64, dataB64] = token.split('.');
    if (!ivB64 || !tagB64 || !dataB64) return null;

    const decipher = crypto.createDecipheriv(
      algorithm,
      hashKey(secret),
      Buffer.from(ivB64, 'base64url')
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64url')),
      decipher.final(),
    ]).toString('utf8');

    const payload = JSON.parse(decrypted);
    if (!payload.exp || Date.now() > payload.exp) return null;
    // Reject legacy/static mock tokens
    if (!payload.sub || !payload.role) return null;
    return payload;
  } catch {
    return null;
  }
}