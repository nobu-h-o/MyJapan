'use client';

interface Question6Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Question6({ value, onChange, onNext, onPrev }: Question6Props) {
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
    <section id="Q6" className="visible">
      <div className="Text">
        <h1>Q6. Indoors or Outdoors?</h1>
        <select 
          id="preference6" 
          required 
          value={value} 
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Indoors">Indoors</option>
          <option value="Outdoors">Outdoors</option>
        </select>
        <div className="navigation">
          <button className="prev round" onClick={onPrev}>&lt;</button>
          <button className="next rectangle" onClick={handleNext}>Submit</button>
        </div>
      </div>
    </section>
  );
} 