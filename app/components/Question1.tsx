'use client';

interface Question1Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function Question1({ value, onChange, onNext }: Question1Props) {
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
    <section id="Q1" className="visible">
      <div className="Text">
        <h1>Q1. Where are you visiting?</h1>
        <select 
          id="preference1" 
          required 
          value={value} 
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Hokkaido">Hokkaido</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Kyoto">Kyoto</option>
          <option value="Osaka">Osaka</option>
          <option value="Okinawa">Okinawa</option>
        </select>
        <div className="navigation">
          <button className="next round" onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
} 