import pb from '../lib/pocketbase';
import {
  Collections,
  QueuedUserRecord,
  QueuedUserResponse,
} from '../types/pocketbase-types';

export const createQueuedUser = async (id: string) => {
  const collection = pb.collection(Collections.QueuedUser);
  const data: QueuedUserRecord = {
    user: id,
  };
  const res = await collection.create<QueuedUserResponse>(data);

  return res.id;
};

export const deleteQueuedUser = async (id: string) => {
  const collection = pb.collection(Collections.QueuedUser);

  await collection.delete(id);
};
