import { useNavigate } from 'react-router-dom';

type Props = {
  small?: true;
};

const Header = ({ small }: Props) => {
  const navigate = useNavigate();
  const nameTextSize = small ? 'text-[20px]' : 'text-2xl';
  const onlineTextSize = small ? 'text-[12px]' : 'text-base';

  return (
    <div className="flex flex-col items-center">
      <span
        onClick={() => navigate('/')}
        className={`${nameTextSize} cursor-pointer uppercase tracking-[14.08px]`}
      >
        Omegeru
      </span>
      <span className={`${onlineTextSize}`}>20 Online</span>
    </div>
  );
};

export default Header;
