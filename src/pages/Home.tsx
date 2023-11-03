import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Interests from '../components/Interests';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-[20px] justify-center items-center  max-w-sm px-[16px]">
        <Header />

        <Interests />

        <button
          onClick={() => navigate('/chat')}
          className="btn btn-secondary shadow-pop-out-shallow text-info rounded-[20px]"
        >
          Chat with strangers
        </button>
      </div>
    </div>
  );
};

export default Home;
