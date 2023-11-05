import pb from '../lib/pocketbase';
import {
  Collections,
  SessionRecord,
  SessionResponse,
} from '../types/pocketbase-types';
import { updateSessionId } from './user';

const collection = pb.collection(Collections.Session);

export const getSession = async (id: string) => {

  const session = await collection.getOne<SessionResponse>(id);

  return session;
};
// export const addUserInSession = async (
//   session: SessionResponse,
//   userId: string,
//   sessionSeat: number
// ) => {
//   const { id, user1, user2, messages } = session;

//   let data: Partial<SessionRecord> = {
   
//     user2: userId,
//   };
//   if (sessionSeat === 1) data = { user1: userId,  };
  
//   console.log('sessionSeat:', sessionSeat, data);
//   const res = await collection.update<SessionResponse>(id, data);

//   return res;
// };

// export const leaveSession = async (sessionId: string, userId: string) => {
//   const session = await getSession(sessionId);
//   const { id, user1, user2 } = session;
  
//   let data: Partial<SessionRecord> = {};

//   if (user1 === userId) data = { user1: '' };
//   if (user2 === userId) data = { user2: '' };

//   const res = await collection.update<SessionResponse>(id, data);
//   await updateSessionId(userId, '');
//   return res;
// };

// No more rejoin, due to the absence of 5 min delay when in local

// Problem: race condition from update request
// Description: when 2 users connect to a session, they
// add their id in session.user1 | session.user2. The
// problem is when the 2 users write at the same time, only
// 1 of the request make it
// Solution: 
// 1. Put session participants in different row
// Con: would have to listen to the collection, which puts
// unnecessary stress on the server
// 2.  