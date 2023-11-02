import pb from '../lib/pocketbase';
import {
  Collections,
  SessionResponse,
  UserRecord,
  UserResponse,
} from '../types/pocketbase-types';

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
