'use client';

interface Question4Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Question4({ value, onChange, onNext, onPrev }: Question4Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleNext = () => {
    if (value) {
      onNext();
    } else {
      alert('Please provide an answer to proceed.');
    }
  };

  return (
    <section id="Q4" className="visible">
      <div className="Text">
        <h1>Q4. How do you feel about unknown places and experiences?</h1>
        <select 
          id="preference4" 
          required 
          value={value} 
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Sounds fun!">Sounds fun!</option>
          <option value="Neutral">Neutral</option>
          <option value="Would like to visit famous areas first">Would like to visit famous areas first</option>
        </select>
        <div className="navigation">
          <button className="prev round" onClick={onPrev}>&lt;</button>
          <button className="next round" onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
} 