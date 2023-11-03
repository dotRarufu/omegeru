export type Message = {
  text: string;
  yours: boolean;
};

const sampleConversation: Message[] = [
  { text: 'Hi', yours: false },
  { text: 'asl', yours: true },
  { text: 'F18', yours: false },
  { text: 'm18', yours: true },
  { text: 'Where are you from?', yours: false },
  { text: 'philippines', yours: true },
  { text: 'Nice, san ka sa Pilipinas?', yours: false },
  { text: 'sa manila', yours: true },
  { text: 'ikaw taga saan ka?', yours: true },
  { text: 'Paranaque ', yours: false },
];

export default sampleConversation;
