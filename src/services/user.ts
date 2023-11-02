import pb from '../lib/pocketbase';
import generator from 'secure-random-password';

import {
  Collections,
  UserRecord,
  UserResponse,
} from '../types/pocketbase-types';

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

export const updateClientId = async (userId: string) => {
  const clientId = pb.realtime.clientId;
  const collection = pb.collection(Collections.User);
  const data: Pick<UserRecord, 'client_id'> = {
    client_id: clientId,
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
