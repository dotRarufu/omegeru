import { useCallback, useEffect, useState } from 'react';
import { User } from './useUser';
import {
  SubscriptionCallback,
  createJoinSessionMessage,
  createQuitSessionMessage,
  getMessages,
  watchSession,
} from '../services/message';
import { updateClientId } from '../services/user';
import pb from '../lib/pocketbase';
import { Collections } from '../types/pocketbase-types';
import { Message } from '../data/sampleConversation';

type Props = {
  user: User;
  sessionId: string | null;
  onRejoin: () => void;
  onJoin: () => void;
  onPartnerLeave: () => void;
};

const useSession = ({
  user,
  sessionId,
  onJoin,
  onPartnerLeave,
}: Props) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [errorCounter, setErrorCounter] = useState(0);
  const [isWaitingForPartner, setIsWaitingForPartner] = useState<
    boolean | null
  >(null);
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [shouldLeave, setShouldLeave] = useState(false);
  
  // Reset messages on session change
  useEffect(() => {
    if (!sessionId) return;

    setMessages([]);
    setIsWaitingForPartner(true);
  }, [sessionId]);

  //
  useEffect(() => {
    if (!user || !sessionId) return;
    if (hasJoined) return;

    const doThis = async () => {
      await updateClientId(user.id, user);
      await createJoinSessionMessage(sessionId, user.id);
      setHasJoined(true);
      onJoin();
    };

    doThis().catch(console.info);
  }, [hasJoined, onJoin, sessionId, user]);

  // Watch session for messages
  useEffect(() => {
    if (!sessionId) return;

    const callback: SubscriptionCallback = data =>
      setMessages(data.record.messages);
    watchSession(sessionId, callback).catch(() => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
      // solves concurrent request by the session's users
      setErrorCounter(o => o + 1);
    });

    return () => {
      void pb.collection(Collections.Session).unsubscribe(sessionId);
    };
  }, [sessionId, errorCounter]);

  const disconnect = useCallback(async () => {
    if (!sessionId) return;

    await pb.collection(Collections.Session).unsubscribe(sessionId);
    await createQuitSessionMessage(sessionId);

    setIsWaitingForPartner(null);
    setHasJoined(false);
  }, [sessionId]);

  // Disconnect when partner disconnect
  useEffect(() => {
    if (isWaitingForPartner === null) return;
    if (isWaitingForPartner) return;
    if (!shouldLeave) return;

    console.log('partner disconnected');
    disconnect()
      .then(() => onPartnerLeave())
      .catch(console.info);
  }, [disconnect, isWaitingForPartner, onPartnerLeave, shouldLeave]);

  // Get messages
  useEffect(() => {
    if (!user) return;

    getMessages(messages)
      .then(messages => {
        const messagesData: Message[] = messages.map(m => ({
          text: m.content,
          yours: m.sender === user.id,
        }));

        setMessagesData(messagesData);
      })
      .catch(console.info);
  }, [messages, user]);

  // Set partner connection
  useEffect(() => {
    if (messagesData.length === 0) return;

    const joinMessages = messagesData.filter(m =>
      m.text.includes('has joined the chat')
    );
    const leaveMessages = messagesData.filter(m =>
      m.text.includes('has left the chat')
    );

    if (joinMessages.length >= 2) setIsWaitingForPartner(false);
    if (leaveMessages.length !== 0) setShouldLeave(true);
  }, [messagesData]);

  return { messagesData, disconnect };
};

export default useSession;
