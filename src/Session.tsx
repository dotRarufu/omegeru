import { useEffect } from 'react';
import pb from './lib/pocketbase';
import { Collections } from './types/pocketbase-types';
import { useParams } from 'react-router-dom';
import { updateClientId, updateIsConnected } from './services/user';
import useUser from './hooks/useUser';

const Session = () => {
  const { sessionId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    const doThis = async () => {
      if (!sessionId || !user) return;

      const collection = pb.collection(Collections.Session);

      // Subscribe to session record
      await collection
        .subscribe(sessionId, data => {
          console.log(data);
          // Display message
        })
        .catch(console.info);

      const clientId = pb.realtime.clientId;

      // Update users' record client id
      updateClientId(user.id, clientId).catch(console.info);

      // Mark user as connected
      updateIsConnected(user.id, true).catch(console.info);
    };

    void doThis();

    return () => {
      pb.collection(Collections.Session)
        .unsubscribe(sessionId)
        .catch(console.info);
    };
  }, [sessionId, user]);

  return <div>Session component: {sessionId}</div>;
};

export default Session;
