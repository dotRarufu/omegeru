import { useEffect, useState } from 'react';
import {
  Collections,
  UserRecord,
  UserResponse,
} from '../types/pocketbase-types';
import { AppData, getAppData, saveAppData } from '../services/appData';
import { createUser, getUser, watchUser } from '../services/user';
import { RecordSubscription } from 'pocketbase';
import pb from '../lib/pocketbase';

export type User = (UserRecord & { id: string }) | null;

const useUser = () => {
  const [user, setUser] = useState<User>(null);
  // Get app data from localStorage
  const [appData, setAppData] = useState<AppData | null>(getAppData());

  // Sync memory data to local storage
  useEffect(() => {
    if (!user) return;
    const newAppData = { sessionId: user.session_id || null, userId: user.id };
    saveAppData(newAppData);
  
  }, [user]);

  // Get or create user
  useEffect(() => {
    if (appData === null) {
      // todo: handle error

      createUser()
        .then(user => {
          setAppData({ userId: user.id, sessionId: null });
          setUser(user);
        })
        .catch(console.info);

      return;
    }

    // Set initial user (callback does not immediately run)
    getUser(appData.userId)
      .then(initial => {
        setUser(initial);

        // todo: handle error
        const callback = (data: RecordSubscription<UserResponse>) => {
          const {
            record: { client_id, id, interests, session_id, session_seat },
          } = data;

          const newUser: User = {
            id,
            client_id,
            interests,
            session_id,
            session_seat,
          };
          setUser(newUser);
          setAppData({ ...appData, sessionId: session_id });
        };

        watchUser(appData.userId, callback).catch(console.info);
      })
      .catch(console.info);

    return () => {
      void pb.collection(Collections.User).unsubscribe(appData.userId);
    };

    // Run only once
  }, []);

  return { user };
};

export default useUser;
