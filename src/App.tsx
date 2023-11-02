import { useEffect, useState } from 'react';
import pb from './lib/pocketbase';
type a = { username: string };
function App() {
  const [count, setCount] = useState(0);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // setIsConnected(pb.realtime.isConnected);
      // setClientId(pb.realtime.clientId);
      console.log(
        `isConnected: ${pb.realtime.isConnected ? 'truthy' : 'falsy'}`
      );
      console.log(`clientId: ${pb.realtime.clientId}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const connect = async () => {
    await pb.realtime.subscribe('user', function (e) {
      console.log(e);
    });

    console.log('connects: ' + (pb.authStore.model as unknown as a).username);
  };

  const disconnect = async () => {
    await pb.realtime.unsubscribe();
    console.log('disconnects');
  };

  const login = async () => {
    const res = await pb
      .collection('users')
      .authWithPassword('testUser123', 'testUser123');
    console.log(
      'login success:',
      (pb.authStore.model as unknown as a).username
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">
      {/* <div className="flex flex-col text-lg">
        <span>Client ID: {clientId}</span>
        <span>Connected: {isConnected ? "truthy" : "falsy"}</span>
      </div> */}
      <button onClick={() => void connect()} className="btn btn-primary">
        Connect
      </button>
      <button onClick={() => void disconnect()} className="btn btn-error">
        Disconnect{' '}
      </button>
      <button onClick={() => void login()} className="btn btn-primary">
        Login
      </button>
    </div>
  );
}

export default App;
