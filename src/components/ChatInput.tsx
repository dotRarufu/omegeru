import { useState } from 'react';
import Send from '../icons/Send';
import { User } from '../hooks/useUser';
import { sendMessage } from '../services/message';

type Props = {
  user: User;
  sessionId: string | null;
};

const ChatInput = ({ user, sessionId }: Props) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!sessionId || !user || !newMessage) return;

    sendMessage(sessionId, user.id, newMessage).catch(console.info);
    setNewMessage('');
  };

  return (
    <>
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
    </>
  );
};

export default ChatInput;
