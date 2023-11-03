import { useCallback, useEffect, useState } from 'react';
import Bubble from '../components/Bubble';
import Header from '../components/Header';

import Send from '../icons/Send';
import Interests from '../components/Interests';
import { createQueuedUser, deleteQueuedUser } from '../services/queue';
import { RecordSubscription } from 'pocketbase';
import { Collections, UserRecord } from '../types/pocketbase-types';
import useUser from '../hooks/useUser';
import { updateClientId, watchUser } from '../services/user';
import pb from '../lib/pocketbase';
import {
  addUserInSession,
  getSession,
  leaveSession,
} from '../services/session';
import {
  SubscriptionCallback,
  createJoinSessionMessage,
  getMessages,
  sendMessage,
  watchSession,
} from '../services/message';
import { Message } from '../data/sampleConversation';

// todo: use zustand, react query

type State = 'inQueue' | 'disconnected' | 'inSession' | 'queueCanceled';
const STATES: {
  inQueue: State;
  disconnected: State;
  inSession: State;
  queueCanceled: State;
} = {
  inQueue: 'inQueue',
  inSession: 'inSession',
  queueCanceled: 'queueCanceled',
  disconnected: 'disconnected',
};

// todo:
// queue by interest
// fix chat race condition
// limit 1 message per 5 second, refactor might fix this

const Chat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<State>(STATES.disconnected);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[] | null>(null);
  const [rawMessages, setRawMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // todo: initialize with rejoined variable
  const [bothJoined, setBothJoined] = useState(false);

  // Join back in session
  useEffect(() => {
    if (!user) return;
    if (!user.session_id) return;
    console.log('session id:', user.session_id);
    getSession(user.session_id)
      .then(session => {
        setSessionId(session.id);
        setState(STATES.inSession);
      })
      .catch(console.info);
  }, [user]);

  // Get messages
  useEffect(() => {
    if (!user) return;
    if (rawMessages.length === 0) {
      setMessages([]);
      return;
    }

    getMessages(rawMessages)
      .then(messages => {
        const newMessages: Message[] = messages.map(m => ({
          text: m.content,
          yours: m.sender === user.id,
        }));

        setMessages(newMessages);
      })
      .catch(console.info);
  }, [rawMessages, user]);

  // Dev
  useEffect(() => {
    console.log('state:', state);
  }, [state]);

  const joinQueue = useCallback(async () => {
    if (!user) return;

    const callback = (data: RecordSubscription<UserRecord>) => {
      const {
        record: { session_id },
      } = data;

      if (!session_id) return;

      // Clean up
      void pb.collection(Collections.User).unsubscribe(user.id);
      setSessionId(session_id);
      setState(STATES.inSession);
    };

    setRawMessages([]);
    await watchUser(user.id, callback);
    await createQueuedUser(user.id);
    console.log('in queue:', user.id);
  }, [user]);

  const disconnect = useCallback(async () => {
    if (!sessionId || !user) return;

    await leaveSession(sessionId, user.id);
    await pb.collection(Collections.Session).unsubscribe(sessionId);
    // await createQuitSessionMessage(sessionId);
    setSessionId(null);
    setParticipants(null);
    setBothJoined(false);
  }, [sessionId, user]);

  const leaveQueue = useCallback(async () => {
    if (!user) return;

    await deleteQueuedUser(user.id);
  }, [user]);

  const handleLeftButton = () => {
    switch (state) {
      case STATES.inQueue:
        leaveQueue().catch(console.info);
        setState(STATES.queueCanceled);
        break;
      case STATES.inSession:
        disconnect().catch(console.info);
        // temporary, should display disconnected message instead
        setMessages([]);
        setState(STATES.disconnected);
        alert("You've disconnected");
        break;
      case STATES.disconnected:
        joinQueue().catch(console.info);
        setState(STATES.inQueue);
        break;
      case STATES.queueCanceled:
        joinQueue().catch(console.info);
        setState(STATES.inQueue);
        break;
      default:
        throw new Error('Unknown state');
    }
  };

  // Subscribe to session
  useEffect(() => {
    if (!sessionId || !user) return;

    const doThis = async () => {
      const callback: SubscriptionCallback = data => {
        const { messages, user1, user2 } = data.record;
        const participants = [user1, user2];
        // console.log('session updaes:', participants);
        if (participants.every(p => !!p) && participants.length >= 2)
          setBothJoined(true);

        setParticipants(participants);
        // todo: set messages
        // console.log('rawMessages:', messages);
        setRawMessages(messages);
      };

      await watchSession(sessionId, callback);
      await updateClientId(user.id);

      // Add user to session
      if (!sessionId || !user || !user.session_seat) return;

      const session = await getSession(sessionId);
      const userExistInSession =
        session.user1 === user.id || session.user2 === user.id;

      if (userExistInSession) {
        // Show welcome back message
        // console.log('welcome back');
        return;
      }
      // Show first time welcome message
      await addUserInSession(session, user.id, user.session_seat);
      // console.log('createjoinsessionmessage');
      await createJoinSessionMessage(sessionId);
    };

    doThis().catch(console.info);

    return () => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
    };
  }, [sessionId, user]);

  // Disconnect when partner disconnect
  useEffect(() => {
    if (participants === null) return;

    if (bothJoined && participants.filter(p => !!p).length < 2) {
      console.log('Stranger disconnected');
      disconnect()
        .then(_ => setState(STATES.disconnected))
        .catch(console.info);
    }
  }, [bothJoined, disconnect, participants, sessionId]);

  const handleSendMessage = () => {
    if (!sessionId || !user || !newMessage) return;

    sendMessage(sessionId, user.id, newMessage).catch(console.info);
    setNewMessage('');
  };

  return (
    <div className="w-screen py-[16px] gap-[16px] flex flex-col h-screen max-w-md mx-auto border px-[16px]">
      <Header small />

      <div className="shadow-pop-in-deep rounded-[16px] px-[8px] overflow-clip h-full">
        <div className="py-[16px] pr-[16px] overflow-y-scroll h-full  px-[8px] gap-[8px]  flex flex-col ">
          {messages.map(({ text, yours }, index) => (
            <Bubble key={index} you={yours} text={text} />
          ))}
        </div>
      </div>

      {state === STATES.disconnected ||
        (state === STATES.queueCanceled && <Interests />)}
      {state === STATES.inQueue && (
        <div className="text-primary text-sm">Finding a stranger</div>
      )}

      <div className="flex gap-[16px]">
        <button
          onClick={handleLeftButton}
          className={`btn btn-secondary shadow-pop-out-shallow ${getLeftButtonTextColor(
            state
          )}  rounded-[20px]`}
        >
          {getLeftButtonText(state)}
        </button>
        {/* <div className="flex w-full gap-[8px] items-center"> */}
        {/* // todo: make this expand depending on content */}
        <input
          // contentEditable
          placeholder="Movie..."
          className="px-[16px] py-[8px] shadow-pop-in-shallow focus:outline-0 min-w-[30%] border-0 text-primary input h-full w-full text-base"
          value={newMessage}
          onChange={e => {
            if (e.target.value === '\n') {
              // handleAddInterest();
              return;
            }
            setNewMessage(e.target.value);
          }}
          // onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
        />
        <button
          onClick={() => void handleSendMessage()}
          className="btn btn-secondary shadow-pop-out-shallow rounded-[20px] text-info"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Chat;

const getLeftButtonText = (state: State) => {
  switch (state) {
    case STATES.inQueue:
      return 'Cancel';
    case STATES.disconnected:
      return 'Find';
    case STATES.inSession:
      return 'Leave';
    case STATES.queueCanceled:
      return 'Find';
    default:
      throw new Error('Unknown state');
  }
};

const getLeftButtonTextColor = (state: State) => {
  switch (state) {
    case STATES.inQueue:
      return 'hover:text-error';
    case STATES.disconnected:
      return 'hover:text-success';
    case STATES.queueCanceled:
      return 'hover:text-success';
    case STATES.inSession:
      return 'hover:text-error';
    default:
      throw new Error('Unknown state');
  }
};
