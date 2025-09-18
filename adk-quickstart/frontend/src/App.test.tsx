import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /ADK Quickstart Demo/i });
  expect(heading).toBeInTheDocument();
});
