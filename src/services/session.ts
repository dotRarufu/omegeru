import pb from '../lib/pocketbase';
import {
  Collections,
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
  const collection = pb.collection(Collections.User);
  const user = await collection.getOne<UserResponse>(id);

  return user;
};
