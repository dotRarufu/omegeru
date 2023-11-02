import { RecordSubscription } from 'pocketbase';
import pb from '../lib/pocketbase';
import { Collections, SessionResponse } from '../types/pocketbase-types';

export type SubscriptionCallback = (
  data: RecordSubscription<SessionResponse>
) => void;

export const watchSession = async (
  sessionId: string,
  callback: SubscriptionCallback
) => {
  const collection = pb.collection(Collections.Session);
  const unsubscribe = await collection.subscribe<SessionResponse>(
    sessionId,
    callback
  );

  return unsubscribe;
};
