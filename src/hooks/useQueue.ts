import { User } from './useUser';

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

const useQueue = ({ user, onJoin }: Props) => {
  
  const joinQueue = async () => {
    if (!user) return;

    const callback = (data: RecordSubscription<UserRecord>) => {
      const {
        record: { session_id },
      } = data;

      if (!session_id) return;

      // Clean up
      void pb.collection(Collections.User).unsubscribe(user.id);

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
