import { useCallback, useEffect, useState } from 'react';
import { User } from './useUser';
import {
  SubscriptionCallback,
  createJoinSessionMessage,
  watchSession,
} from '../services/message';
import { updateClientId } from '../services/user';
import {
  addUserInSession,
  getSession,
  leaveSession,
} from '../services/session';
import pb from '../lib/pocketbase';
import { Collections } from '../types/pocketbase-types';

type Props = {
  user: User;
  sessionId: string | null;
  onRejoin: () => void;
  onJoin: () => void;
  onPartnerLeave: () => void;
};

const useSession = ({
  user,
  sessionId,
  onJoin,
  onRejoin,
  onPartnerLeave,
}: Props) => {
  const [participants, setParticipants] = useState<string[] | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [errorCounter, setErrorCounter] = useState(0);
  // todo: onrejoin, set to true
  const [bothJoined, setBothJoined] = useState(false);

  // Reset messages on session change
  useEffect(() => {
    if (!sessionId) return;

    setMessages([]);
  }, [sessionId]);

  // Watch session
  useEffect(() => {
    if (!sessionId || !user) return;

    const doThis = async () => {
      if (!sessionId || !user) return;

      const callback: SubscriptionCallback = data => {
        const { messages, user1, user2 } = data.record;
        const participants = [user1, user2];

        const filtedParticipants = participants.filter(p => !!p);
        !bothJoined && setBothJoined(filtedParticipants.length >= 2);
        setParticipants(filtedParticipants);
        setMessages(messages);
      };

      await watchSession(sessionId, callback);
      await updateClientId(user.id);

      // Add user to session
      if (user.session_seat) {
        const session = await getSession(sessionId);
        const userExistInSession =
          session.user1 === user.id || session.user2 === user.id;

        if (userExistInSession) {
          // Show welcome back message
          onRejoin();

          return;
        }
        // Show first time welcome message
        await addUserInSession(session, user.id, user.session_seat);
        await createJoinSessionMessage(sessionId);
        onJoin();
      }
    };

    doThis().catch(_ => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
      setErrorCounter(o => o + 1);
      console.log('watch fn errored:', errorCounter);
    });

    return () => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
    };
  }, [bothJoined, errorCounter, onJoin, onRejoin, sessionId, user]);

  const disconnect = useCallback(async () => {
    if (!sessionId || !user) return;

    await leaveSession(sessionId, user.id);
    await pb.collection(Collections.Session).unsubscribe(sessionId);
    // await createQuitSessionMessage(sessionId);

    setBothJoined(false);
    setParticipants(null);
  }, [sessionId, user]);

  // Disconnect when partner disconnect
  useEffect(() => {
    if (participants === null || !bothJoined) return;

    if (participants.length < 2) {
      disconnect()
        .then(() => onPartnerLeave())
        .catch(console.info);
    }
  }, [bothJoined, disconnect, onPartnerLeave, participants]);

  return { messages, disconnect };
};

export default useSession;
