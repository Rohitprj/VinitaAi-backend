import { v4 as uuidv4 } from "uuid";

const guestSessions = new Map();

export const createGuestSession = () => {
  const guestId = uuidv4();
  guestSessions.set(guestId, { count: 0, lastUsed: new Date() });
  return guestId;
};

export const incrementGuestChat = (guestId) => {
  const session = guestSessions.get(guestId);
  if (!session) return null;

  session.count += 1;
  session.lastUsed = new Date();
  guestSessions.set(guestId, session);
  return session.count;
};

export const getGuestSession = (guestId) => guestSessions.get(guestId);

export const removeGuestSession = (guestId) => guestSessions.delete(guestId);

export const GUEST_CHAT_LIMIT = 4;
