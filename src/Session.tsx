import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUser from './hooks/useUser';
import { getSession } from './services/session';
import { SubscriptionCallback, watchSession } from './services/message';
import { updateClientId } from './services/user';
import pb from './lib/pocketbase';
import { Collections } from './types/pocketbase-types';

const Session = () => {
  const { sessionId, rejoined } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[] | null>(null);
  // todo: fix callback not running on another tab
  const [bothJoined, setBothJoined] = useState(!!rejoined);

  const disconnect = useCallback(async () => {
    if (!sessionId || !user) return;

    // await leaveSession(sessionId, user.id);
    navigate('/');
  }, [navigate, sessionId, user]);

  // Get participants,m essages initial
  useEffect(() => {
    if (!sessionId) return;

    getSession(sessionId)
      .then(data => {
        const { messages, user1, user2 } = data;
        const participants = [user1, user2];

        setMessages(messages);
        setParticipants(participants);
      })
      .catch(console.info);
  }, [sessionId]);

  // Subscribe to session
  useEffect(() => {
    if (!sessionId || !user) return;

    const doThis = async () => {
      const callback: SubscriptionCallback = data => {
        const { messages, user1, user2 } = data.record;
        const participants = [user1, user2];

        if (participants.every(p => !!p) && participants.length >= 2)
          setBothJoined(true);

        setParticipants(participants);
        setMessages(messages);
      };

      await watchSession(sessionId, callback);

      // await updateClientId(user.id);

      // Add user to session
      if (!sessionId || !user || !user.session_seat) return;

      const session = await getSession(sessionId);
      const userExistInSession =
        session.user1 === user.id || session.user2 === user.id;

      if (userExistInSession) {
        // Show welcome back message
        return;
      }
      // Show firs time welcome message
      // await addUserInSession(session, user.id, user.session_seat);
    };

    doThis().catch(console.info);

    return () => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
    };
  }, [sessionId, user]);

  useEffect(() => {
    if (participants === null) return;

    if (bothJoined && participants.filter(p => !!p).length < 2) {
      console.log('Stranger disconnected');
      disconnect().catch(console.info);
    }
  }, [bothJoined, disconnect, navigate, participants]);

  return (
    <div className="flex flex-col gap-4">
      <span>Session component: {sessionId}</span>
      <span>User ud: {user?.id}</span>
      <span>Messages: {messages.join(', ')}</span>
      <span>Participants: {participants?.join(', ')}</span>
      <button onClick={() => void disconnect()} className="btn btn-primary">
        Disconnect
      </button>
    </div>
  );
};

export default Session;
