import { useState } from 'react';
import Badge from './Badge';

const Interests = () => {
  const [interestTick, setInterestTick] = useState(false);
  const [interests, setInterests] = useState<string[]>(['Web dev']);
  const [value, setValue] = useState('');

  const handleAddInterest = () => {
    const newInterests = [...interests, value];
    setInterests(newInterests);
    setValue('');
  };

  const handleDeleteInterest = (value: string) => () => {
    const newInterests = interests.filter(i => i !== value);
    setInterests(newInterests);
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex gap-[8px]">
        <input
          type="checkbox"
          className="border-0 checkbox-secondary checkbox shadow-pop-in-shallow  rounded-[8px]"
          checked={interestTick}
          onChange={e => setInterestTick(e.target.checked)}
        />
        <span className="text-primary/70">
          Find strangers with similar interest
        </span>
      </div>
      {/* // todo: add transition */}
      {interestTick && (
        <div className="flex-wrap items-center gap-[8px] shadow-pop-in-shallow rounded-[8px] flex p-[8px]">
          {interests.map((i, index) => (
            // todo: use message id instead
            <Badge key={index} onDelete={handleDeleteInterest(i)} text={i} />
          ))}
          <input
            type="text"
            placeholder="Movie..."
            className="focus:outline-0 min-w-[30%] border-0 text-primary text-sm input input-xs"
            value={value}
            onChange={e => {
              if (e.target.value === '\n') {
                handleAddInterest();
                return;
              }
              setValue(e.target.value);
            }}
            onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
          />
        </div>
      )}
    </div>
  );
};

export default Interests;
