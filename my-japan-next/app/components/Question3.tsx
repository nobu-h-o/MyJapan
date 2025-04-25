'use client';

interface Question3Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Question3({ value, onChange, onNext, onPrev }: Question3Props) {
  const decreaseValue = () => {
    const currentValue = parseInt(value);
    if (currentValue > 0) {
      onChange((currentValue - 1).toString());
    }
  };

  const increaseValue = () => {
    const currentValue = parseInt(value);
    if (currentValue < 120) {
      onChange((currentValue + 1).toString());
    }
    if (currentValue === 120) {
      alert("Stop lying...");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (parseInt(newValue) >= 0 && parseInt(newValue) <= 120)) {
      onChange(newValue);
    }
  };

  return (
    <section id="Q3" className="visible">
      <div className="Text">
        <h1>Q3. How old are you?</h1>
        <div className="age-input">
          <button id="decrease-age" className="round" onClick={decreaseValue}>-</button>
          <input 
            type="number" 
            id="preference3" 
            min="0" 
            max="120" 
            value={value}
            onChange={handleInputChange}
          />
          <label htmlFor="preference3">years</label>
          <button id="increase-age" className="round" onClick={increaseValue}>+</button>
        </div>
        <div className="navigation">
          <button className="prev round" onClick={onPrev}>&lt;</button>
          <button className="next round" onClick={onNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
} 