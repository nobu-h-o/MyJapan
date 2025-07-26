import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// テスト用のダミー回答
const answers = {
  preference1: 'Tokyo',
  preference2: '3',
  preference3: '30',
  preference4: 'Sounds fun!',
  preference5: 'Sightseeing',
  preference6: 'Outdoors',
};

// axios のモック
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      text: 'Mock travel plan response'
    }
  })),
  get: jest.fn(() => Promise.resolve({
    data: {}
  }))
}));

// PageFlip のモック
jest.mock('page-flip', () => {
  return jest.fn().mockImplementation(() => ({
    loadFromHTML: jest.fn(),
    destroy: jest.fn(),
    updateFromHtml: jest.fn(),
    turnToPrevPage: jest.fn(),
    turnToNextPage: jest.fn(),
    turnToPage: jest.fn(),
  }));
});

// html2canvas のモック
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
    width: 800,
    height: 600,
  })),
}));

// jsPDF のモック
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addPage: jest.fn(),
    addImage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: {
        getWidth: jest.fn(() => 595),
        getHeight: jest.fn(() => 842),
      },
    },
  })),
}));

describe('質問フロー統合テスト', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  it('全ての質問に回答し、Results画面に遷移できる', async () => {
    render(<Home />);
    const user = userEvent.setup();

    // Title画面
    expect(screen.getByText('Welcome To Japan')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Q1
    expect(screen.getByText('Q1. Where are you visiting?')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), answers.preference1);
    await user.click(screen.getByRole('button', { name: '>' }));

    // Q2
    expect(screen.getByText('Q2. How long is your trip?')).toBeInTheDocument();
    const inputDays = screen.getByLabelText('days');
    fireEvent.change(inputDays, { target: { value: answers.preference2 } });
    await user.click(screen.getByRole('button', { name: '>' }));

    // Q3
    expect(screen.getByText('Q3. How old are you?')).toBeInTheDocument();
    const inputAge = screen.getByLabelText('years');
    fireEvent.change(inputAge, { target: { value: answers.preference3 } });
    await user.click(screen.getByRole('button', { name: '>' }));

    // Q4
    expect(screen.getByText('Q4. How do you feel about unknown places and experiences?')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), answers.preference4);
    await user.click(screen.getByRole('button', { name: '>' }));

    // Q5
    expect(screen.getByText('Q5. What is the most important purpose of travel?')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), answers.preference5);
    await user.click(screen.getByRole('button', { name: '>' }));

    // Q6
    expect(screen.getByText('Q6. Indoors or Outdoors?')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), answers.preference6);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Results
    expect(await screen.findByRole('button', { name: '旅行プランをダウンロード' })).toBeInTheDocument();
  });
}); 