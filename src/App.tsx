import { useEffect, useState } from 'react';
import pb from './lib/pocketbase';
import useUser from './hooks/useUser';
import { getSession } from './services/session';

function App() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (!user.session_id) return;

    getSession(user.session_id)
      .then(session => {
        console.log(session);
        // Join session
        // navigate('/s'+session.id)
      })
      .catch(console.info);
    // Run only once
  }, [user]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">user: {user?.id}</div>
  );
}

export default App;
