import XIcon from '../icons/X';

type Props = {
  text: string;
  onDelete: () => void;
};

const Badge = ({ text, onDelete }: Props) => {
  return (
    <span className="items-center rounded-[8px] shadow-pop-out-shallow flex gap-[4px] py-[4px] px-[8px]">
      <span className="text-primary text-xs">{text}</span>
      <button
        onClick={onDelete}
        className="btn btn-square btn-xs btn-ghost hover:bg-transparent p-0 hover:text-error text-primary/75"
      >
        <XIcon />
      </button>
    </span>
  );
};

export default Badge;
