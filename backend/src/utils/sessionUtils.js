import crypto from "crypto";

// In production, use Redis or database for session storage
const sessions = new Map();

// Create a new session
export const createSession = (contactNumber) => {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

  sessions.set(sessionToken, {
    contactNumber,
    expiresAt,
  });

  return sessionToken;
};

// Validate session
export const validateSession = (sessionToken) => {
  const session = sessions.get(sessionToken);

  if (!session || new Date() > session.expiresAt) {
    sessions.delete(sessionToken);
    return null;
  }

  // Extend session
  session.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  return session.contactNumber;
};
