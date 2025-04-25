'use client';

import { useState } from 'react';
import Title from './components/Title';
import Question1 from './components/Question1';
import Question2 from './components/Question2';
import Question3 from './components/Question3';
import Question4 from './components/Question4';
import Question5 from './components/Question5';
import Question6 from './components/Question6';
import Results from './components/Results';
import Script from 'next/script';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('Title');
  const [preferences, setPreferences] = useState({
    preference1: '',
    preference2: '5',
    preference3: '25',
    preference4: '',
    preference5: '',
    preference6: '',
  });

  const handleNext = () => {
    switch (currentSection) {
      case 'Title':
        setCurrentSection('Q1');
        break;
      case 'Q1':
        if (preferences.preference1) setCurrentSection('Q2');
        break;
      case 'Q2':
        setCurrentSection('Q3');
        break;
      case 'Q3':
        setCurrentSection('Q4');
        break;
      case 'Q4':
        if (preferences.preference4) setCurrentSection('Q5');
        break;
      case 'Q5':
        if (preferences.preference5) setCurrentSection('Q6');
        break;
      case 'Q6':
        if (preferences.preference6) setCurrentSection('Results');
        break;
      default:
        break;
    }
  };

  const handlePrev = () => {
    switch (currentSection) {
      case 'Q2':
        setCurrentSection('Q1');
        break;
      case 'Q3':
        setCurrentSection('Q2');
        break;
      case 'Q4':
        setCurrentSection('Q3');
        break;
      case 'Q5':
        setCurrentSection('Q4');
        break;
      case 'Q6':
        setCurrentSection('Q5');
        break;
      default:
        break;
    }
  };

  const handleChange = (name: string, value: string) => {
    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  return (
    <main>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" />
      
      {currentSection === 'Title' && (
        <Title onNext={handleNext} />
      )}
      
      {currentSection === 'Q1' && (
        <Question1 
          value={preferences.preference1} 
          onChange={(value: string) => handleChange('preference1', value)} 
          onNext={handleNext} 
        />
      )}
      
      {currentSection === 'Q2' && (
        <Question2 
          value={preferences.preference2} 
          onChange={(value: string) => handleChange('preference2', value)} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      )}
      
      {currentSection === 'Q3' && (
        <Question3 
          value={preferences.preference3} 
          onChange={(value: string) => handleChange('preference3', value)} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      )}
      
      {currentSection === 'Q4' && (
        <Question4 
          value={preferences.preference4} 
          onChange={(value: string) => handleChange('preference4', value)} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      )}
      
      {currentSection === 'Q5' && (
        <Question5 
          value={preferences.preference5} 
          onChange={(value: string) => handleChange('preference5', value)} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      )}
      
      {currentSection === 'Q6' && (
        <Question6 
          value={preferences.preference6} 
          onChange={(value: string) => handleChange('preference6', value)} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      )}
      
      {currentSection === 'Results' && (
        <Results key="travel-results" preferences={preferences} />
      )}
    </main>
  );
}
