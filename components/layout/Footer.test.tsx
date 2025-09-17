import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders copyright text', () => {
  render(<Footer />);
  const year = new Date().getFullYear();
  expect(screen.getByText(`© ${year} Set List Manager. Developed by Aaron Hoffman.`)).toBeInTheDocument();
}); 