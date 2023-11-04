import { useEffect, useState } from 'react';
import { Message } from '../data/sampleConversation';
import Bubble from './Bubble';
import { User } from '../hooks/useUser';
import { getMessages } from '../services/message';

type Props = {
  messagesId: string[];
  user: User;
};
const Messages = ({ messagesId, user }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Get messages
  useEffect(() => {
    if (!user) return;
    if (messagesId.length === 0) {
      setMessages([]);
      return;
    }

    getMessages(messagesId)
      .then(messages => {
        const newMessages: Message[] = messages.map(m => ({
          text: m.content,
          yours: m.sender === user.id,
        }));

        setMessages(newMessages);
      })
      .catch(console.info);
  }, [messagesId, user]);

  return (
    <div className="shadow-pop-in-deep rounded-[16px] px-[8px] overflow-clip h-full">
      <div className="py-[16px] pr-[16px] overflow-y-scroll h-full  px-[8px] gap-[8px]  flex flex-col ">
        {messages.map(({ text, yours }, index) => (
          <Bubble key={index} you={yours} text={text} />
        ))}
      </div>
    </div>
  );
};

export default Messages;
