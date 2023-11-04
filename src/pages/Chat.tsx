import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Interests from '../components/Interests';
import useUser from '../hooks/useUser';
import useQueue from '../hooks/useQueue';
import useSession from '../hooks/useSession';
import Messages from '../components/Messages';
import ChatInput from '../components/ChatInput';

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
// limit 1 message per 5 second, refactor might fix this

const Chat = () => {
  const { user } = useUser();
  const [state, setState] = useState<State>(STATES.disconnected);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { joinQueue, leaveQueue } = useQueue({
    user,
    onRejoin: setSessionId,
    onJoin: setSessionId,
  });
  // console.log('chat comp renders');
  const { disconnect, messages } = useSession({
    user,
    sessionId,
    onJoin: () => setState(STATES.inSession),
    onPartnerLeave: () => {
      // Show message 'partner left the chat'
      setSessionId(null);
      setState(STATES.disconnected);
    },
    onRejoin: () => setState(STATES.inSession),
  });

  // Dev
  useEffect(() => {
    console.log('state:', state);
  }, [state]);

  const handleLeftButton = () => {
    switch (state) {
      case STATES.inQueue:
        leaveQueue();
        setState(STATES.queueCanceled);
        break;
      case STATES.inSession:
        disconnect().catch(console.info);
        // temporary, should display disconnected message instead

        setSessionId(null);
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

  return (
    <div className="w-screen py-[16px] gap-[16px] flex flex-col h-screen max-w-md mx-auto border px-[16px]">
      <Header small />

      {/* // todo: move user props in context */}
      <Messages messagesId={messages} user={user} />

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
        <ChatInput sessionId={sessionId} user={user} />
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
