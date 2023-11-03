type Props = {
  you: boolean;
  text: string;
};

const Bubble = ({ you, text }: Props) => {
  const alignment = you ? 'justify-end' : 'justify-start';
  const color = you ? 'text-info' : 'text-primary';

  // todo: show timestamp on tap
  return (
    <div className={`flex w-full ${alignment}`}>
      <div
        className={`bg-base rounded-[20px] shadow-pop-out-shallow p-[16px] ${color} max-w-[75%]`}
      >
        {text}
      </div>
    </div>
  );
};

export default Bubble;
