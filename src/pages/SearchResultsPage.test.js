import { fireEvent, render, screen } from '@testing-library/react';
jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

import SearchResultsPage from './SearchResultsPage';

const renderSearchResultsPage = () => {
  render(<SearchResultsPage />);
};

test('filters listings by budget and resets back to the default results', () => {
  renderSearchResultsPage();

  expect(screen.getByText('Velez Boarding House')).toBeInTheDocument();
  expect(screen.getByText('Capitol Student Pad')).toBeInTheDocument();

  const budgetSlider = screen.getByRole('slider', { name: /maximum budget/i });
  fireEvent.change(budgetSlider, { target: { value: '9000' } });
  fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

  expect(screen.getByText('Velez Boarding House')).toBeInTheDocument();
  expect(screen.queryByText('Capitol Student Pad')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

  expect(screen.getByText('Capitol Student Pad')).toBeInTheDocument();
});
