import pb from '../lib/pocketbase';
import generator from 'secure-random-password';

import {
  Collections,
  UserRecord,
  UserResponse,
} from '../types/pocketbase-types';
import { RecordSubscription } from 'pocketbase';
import { User } from '../hooks/useUser';

export const createUser = async () => {
  const collection = pb.collection(Collections.User);
  const password = generator.randomPassword({
    length: 8,
  });
  const data = {
    password,
    passwordConfirm: password,
  };
  const user = await collection.create<UserResponse>(data);

  return user;
};

export const getUser = async (id: string) => {
  const collection = pb.collection(Collections.User);
  const user = await collection.getOne<UserResponse>(id);
  return user;
};

export const updateClientId = async (userId: string, user: User) => {
  const clientId = pb.realtime.clientId;
  const collection = pb.collection(Collections.User);
  const data: UserRecord = {
    client_id: clientId,
    interests: user?.interests || [null],
    session_id: user?.session_id || '',
    session_seat: user?.session_seat,
  };
  await collection.update<UserResponse>(userId, data);
};

export const updateSessionId = async (userId: string, sessionId: string) => {
  const collection = pb.collection(Collections.User);
  const data: Pick<UserRecord, 'session_id'> = {
    session_id: sessionId,
  };
  await collection.update<UserResponse>(userId, data);
};

export const updateInterest = async (userId: string, interests: string[]) => {
  const collection = pb.collection(Collections.User);
  const data: Pick<UserRecord, 'interests'> = {
    interests,
  };
  await collection.update<UserResponse>(userId, data);
};

export const watchUser = async (
  userId: string,
  callback: (data: RecordSubscription<UserResponse>) => void
) => {
  const collection = pb.collection(Collections.User);
  const unsubscribe = await collection.subscribe<UserResponse>(
    userId,
    callback
  );

  return unsubscribe;
};
