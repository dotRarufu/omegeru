import pb from '../lib/pocketbase';
import {
  Collections,
  SessionRecord,
  SessionResponse,
} from '../types/pocketbase-types';
import { updateSessionId } from './user';

// export const createUser = async () => {
//   const collection = pb.collection(Collections.User);
//   const data: UserRecord = {
//     interests: JSON.stringify([null]),
//   };
//   const user = await collection.create<UserResponse>(data);

//   return user;
// };

export const getSession = async (id: string) => {
  console.log('get session:', id);
  const collection = pb.collection(Collections.Session);
  const session = await collection.getOne<SessionResponse>(id);

  return session;
};
export const addUserInSession = async (
  session: SessionResponse,
  userId: string,
  sessionSeat: number
) => {
  const { id, user1 } = session;
  const collection = pb.collection(Collections.Session);
  let data: Partial<SessionRecord> = {
    user2: userId,
  };

  if (sessionSeat === 1) data = { user1: userId };
  console.log('add user ins session:', data);
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
