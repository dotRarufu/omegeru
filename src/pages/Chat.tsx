import { useEffect, useState } from 'react';
import Bubble from '../components/Bubble';
import Header from '../components/Header';
import sampleConversation, { Message } from '../data/sampleConversation';
import Send from '../icons/Send';
import Interests from '../components/Interests';

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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<State>(STATES.disconnected);

  const handleLeftButton = () => {
    switch (state) {
      case STATES.inQueue:
        setState(STATES.queueCanceled);
        break;
      case STATES.disconnected:
        setState(STATES.inQueue);
        break;
      case STATES.inSession:
        setState(STATES.disconnected);
        break;
      case STATES.queueCanceled:
        setState(STATES.inQueue);
        break;
      default:
        throw new Error('Unknown state');
    }
  };

  // Load messages when in session
  useEffect(() => {
    if (state !== STATES.inSession) return;

    setMessages(sampleConversation);
  }, [state]);

  const devPutInMatch = () => {
    setState(STATES.inSession);
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

      {state === STATES.inQueue && (
        <div className="btn btn-primary" onClick={devPutInMatch}>
          put in session
        </div>
      )}
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
        <div
          contentEditable
          placeholder="Movie..."
          className="px-[16px] py-[8px] shadow-pop-in-shallow focus:outline-0 min-w-[30%] border-0 text-primary input h-full w-full text-base"
          // value={value}
          onChange={e => {
            // if (e.target.value === '\n') {
            // handleAddInterest();
            // return;
            // }
            // setValue(e.target.value);
          }}
          // onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
        />
        <button className="btn btn-secondary shadow-pop-out-shallow rounded-[20px] text-info">
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
