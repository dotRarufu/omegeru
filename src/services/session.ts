import pb from '../lib/pocketbase';
import {
  Collections,
  SessionRecord,
  SessionResponse,
} from '../types/pocketbase-types';
import { updateSessionId } from './user';

export const getSession = async (id: string) => {
  const collection = pb.collection(Collections.Session);
  const session = await collection.getOne<SessionResponse>(id);

  return session;
};
export const addUserInSession = async (
  session: SessionResponse,
  userId: string,
  sessionSeat: number
) => {
  const { id } = session;
  const collection = pb.collection(Collections.Session);
  let data: Partial<SessionRecord> = {
    user2: userId,
  };

  if (sessionSeat === 1) data = { user1: userId };

  const res = await collection.update<SessionResponse>(id, data);

  return res;
};

export const leaveSession = async (sessionId: string, userId: string) => {
  const session = await getSession(sessionId);
  const { id, user1, user2 } = session;
  const collection = pb.collection(Collections.Session);
  let data: Partial<SessionRecord> = {};

  if (user1 === userId) data = { user1: '' };
  if (user2 === userId) data = { user2: '' };

  const res = await collection.update<SessionResponse>(id, data);
  await updateSessionId(userId, '');
  return res;
};
