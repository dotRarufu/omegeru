import { useCallback, useEffect, useState } from 'react';
import useUser, { User } from './useUser';
import { addUserInSession, getSession } from '../services/session';
import {
  SubscriptionCallback,
  createJoinSessionMessage,
  watchSession,
} from '../services/message';
import pb from '../lib/pocketbase';
import { updateClientId, watchUser } from '../services/user';
import { Collections, UserRecord } from '../types/pocketbase-types';
import { createQueuedUser } from '../services/queue';
import { RecordSubscription } from 'pocketbase';

type Props = {
  user: User;
  onRejoin: (sessionId: string) => void;
  onJoin: (sessionId: string) => void;
};

const useQueue = ({ user, onRejoin, onJoin }: Props) => {
  // const [rawMessages, setRawMessages] = useState<string[]>([]);
  // todo: initialize with rejoined variable

  // Join back in session
  useEffect(() => {
    if (!user) return;
    if (!user.session_id) return;
    console.log('session id:', user.session_id);
    getSession(user.session_id)
      .then(session => {
        // setState(STATES.inSession);

        onRejoin(session.id);
      })
      .catch(console.info);
  }, [onRejoin, user]);

  const joinQueue = async () => {
    if (!user) return;

    const callback = (data: RecordSubscription<UserRecord>) => {
      const {
        record: { session_id },
      } = data;

      if (!session_id) return;

      // Clean up
      void pb.collection(Collections.User).unsubscribe(user.id);

      // setState(STATES.inSession);
      onJoin(session_id);
    };

    // setRawMessages([]);
    await watchUser(user.id, callback);
    await createQueuedUser(user.id);
    console.log('in queue:', user.id);
  };

  const leaveQueue = () => {
    if (!user) return;

    void pb.collection(Collections.User).unsubscribe(user.id);
  };

  return { joinQueue, leaveQueue };
};

export default useQueue;
