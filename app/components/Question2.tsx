'use client';

interface Question2Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Question2({ value, onChange, onNext, onPrev }: Question2Props) {
  const decreaseValue = () => {
    const currentValue = parseInt(value);
    if (currentValue > 1) {
      onChange((currentValue - 1).toString());
    }
  };

  const increaseValue = () => {
    const currentValue = parseInt(value);
    if (currentValue < 7) {
      onChange((currentValue + 1).toString());
    }
    if (currentValue === 7) {
      alert("Sorry, we currently only support a trip that is up to 7 days long... :(");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (parseInt(newValue) >= 1 && parseInt(newValue) <= 7)) {
      onChange(newValue);
    }
  };

  return (
    <section id="Q2" className="visible">
      <div className="Text">
        <h1>Q2. How long is your trip?</h1>
        <div className="days-input">
          <button id="decrease-days" className="round" onClick={decreaseValue}>-</button>
          <input 
            type="number" 
            id="preference2" 
            min="1" 
            max="7" 
            value={value}
            onChange={handleInputChange}
          />
          <label htmlFor="preference2">days</label>
          <button id="increase-days" className="round" onClick={increaseValue}>+</button>
        </div>
        <div className="navigation">
          <button className="prev round" onClick={onPrev}>&lt;</button>
          <button className="next round" onClick={onNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
} 