import { RecordSubscription } from 'pocketbase';
import pb from '../lib/pocketbase';
import {
  Collections,
  MessageRecord,
  MessageResponse,
  SessionResponse,
} from '../types/pocketbase-types';
import { getSession } from './session';

const collection = pb.collection(Collections.Message);
const sessionCollection = pb.collection(Collections.Session);

export type SubscriptionCallback = (
  data: RecordSubscription<SessionResponse>
) => void;

export const watchSession = async (
  sessionId: string,
  callback: SubscriptionCallback
) => {
  const unsubscribe = await sessionCollection.subscribe<SessionResponse>(
    sessionId,
    callback
  );

  return unsubscribe;
};

const getMessage = async (id: string) => {
  const message = await collection.getOne<MessageResponse>(id);

  return message;
};

export const getMessages = async (messagesId: string[]) => {
  const requests = messagesId.map(m => getMessage(m));
  const messages = await Promise.all(requests);

  return messages;
};

const SYSTEM_USER_ID = 't66d1o8ktgkz40p';

export const createJoinSessionMessage = async (
  sessionId: string,
  userId: string
) => {
  const data: MessageRecord = {
    content: userId + ' has joined the chat',
    // todo: add to constants
    sender: SYSTEM_USER_ID,
  };
  const newMessage = await collection.create(data);
  const oldMessages = (await getSession(sessionId)).messages;
  const messages = [...oldMessages, newMessage.id];
  await sessionCollection.update(sessionId, {
    messages,
  });
};

export const createQuitSessionMessage = async (sessionId: string) => {
  const data: MessageRecord = {
    content: 'A user has left the chat',
    // todo: add to constants
    sender: SYSTEM_USER_ID,
  };
  const newMessage = await collection.create(data);
  const oldMessages = (await getSession(sessionId)).messages;
  const messages = [...oldMessages, newMessage.id];
  await sessionCollection.update(sessionId, {
    messages,
  });
};

const createMessage = async (sender: string, content: string) => {
  const data: MessageRecord = {
    sender,
    content,
  };
  const res = await collection.create(data);

  return res;
};

export const sendMessage = async (
  sessionId: string,
  sender: string,
  content: string
) => {
  const message = await createMessage(sender, content);
  const oldMessages = (await getSession(sessionId)).messages;
  const messages = [...oldMessages, message.id];
  await sessionCollection.update(sessionId, {
    messages,
  });
};
