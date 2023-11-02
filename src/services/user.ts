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
