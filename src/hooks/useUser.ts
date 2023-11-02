import { useEffect, useState } from 'react';
import { UserRecord } from '../types/pocketbase-types';
import { AppData, getAppData, saveAppData } from '../services/appData';
import { createUser, getUser } from '../services/user';

type User = (UserRecord & { id: string }) | null;

const useUser = () => {
  const [user, setUser] = useState<User>(null);
  // Get app data from localStorage
  const [appData, setAppData] = useState<AppData>(getAppData());

  // Sync memory data to local storage
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Get or create user
  useEffect(() => {
    if (appData === null) return;
    if (!appData.userId) {
      // todo: handle error
      createUser()
        .then(user => {
          setAppData({ userId: user.id });
          setUser(user);
        })
        .catch(console.info);

      return;
    }

    // todo: handle error
    getUser(appData.userId)
      .then(user => {
        setAppData({ userId: user.id });
        setUser(user);
      })
      .catch(console.info);
    // Run only once
  }, []);

  return { user };
};

export default useUser;
