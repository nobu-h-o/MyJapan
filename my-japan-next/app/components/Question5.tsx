'use client';

interface Question5Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Question5({ value, onChange, onNext, onPrev }: Question5Props) {
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
    <section id="Q5" className="visible">
      <div className="Text">
        <h1>Q5. What is the most important purpose of travel?</h1>
        <select 
          id="preference5" 
          required 
          value={value} 
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="Learning about the country's history and culture">Learning about the country's history and culture</option>
          <option value="Sports and outdoor activities">Sports and outdoor activities</option>
          <option value="Food and Cuisine">Food and Cuisine</option>
          <option value="Interacting with the locals">Interacting with the locals</option>
        </select>
        <div className="navigation">
          <button className="prev round" onClick={onPrev}>&lt;</button>
          <button className="next round" onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
} 