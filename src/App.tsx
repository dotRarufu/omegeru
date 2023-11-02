import { useEffect, useState } from 'react';
import pb from './lib/pocketbase';
import useUser from './hooks/useUser';
import { getSession } from './services/session';
import { createQueuedUser, deleteQueuedUser } from './services/queue';
import {
  Collections,
  UserRecord,
  UserResponse,
} from './types/pocketbase-types';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Join back in session
  useEffect(() => {
    if (!user) return;
    if (!user.session_id) return;
    console.log('session id:', user.session_id);
    getSession(user.session_id)
      .then(session => {
        console.log('join back in session:', session);
        navigate('/s/' + session.id);
      })
      .catch(console.info);
  }, [user]);

  const joinQueue = async () => {
    if (!user) return;

    console.log('in queue');

    const queueId = await createQueuedUser(user.id);
    const collection = pb.collection(Collections.User);
    await collection.subscribe<UserRecord>(user.id, data => {
      console.log(data);

      const {
        record: { session_id },
      } = data;

      if (!session_id) return;

      // Clean up
      void pb.collection(Collections.User).unsubscribe(user.id);
      deleteQueuedUser(queueId).catch(console.info);

      navigate('/s/' + session_id);
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">
      <span>user: {user?.id}</span>
      <div>
        <button onClick={() => void joinQueue()} className="btn btn-primary">
          Join queue
        </button>
      </div>
    </div>
  );
};

export default App;
