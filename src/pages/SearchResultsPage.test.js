import { fireEvent, render, screen } from '@testing-library/react';
const mockToggleSaved = jest.fn();
const mockSearchParams = new URLSearchParams('');

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ search: '' }),
    useSearchParams: () => [mockSearchParams]
  }),
  { virtual: true }
);

jest.mock('../context/RentalDataContext', () => ({
  useRentalData: () => ({
    listings: [
      {
        id: 1,
        title: 'CNU Capitol House',
        city: 'Cebu City',
        neighborhood: 'Capitol Site',
        university: 'Cebu Normal University',
        price: 6800,
        beds: 1,
        baths: 1,
        sizeSqm: 14,
        description: 'Near CNU',
        imageUrls: [],
        saved: false
      },
      {
        id: 2,
        title: 'USC Talamban Home',
        city: 'Cebu City',
        neighborhood: 'Talamban',
        university: 'University of San Carlos Talamban Campus',
        price: 7900,
        beds: 1,
        baths: 1,
        sizeSqm: 19,
        description: 'Near USC Talamban',
        imageUrls: [],
        saved: false
      },
      {
        id: 3,
        title: 'Banilad Study Nest',
        city: 'Cebu City',
        neighborhood: 'Banilad',
        university: 'University of Cebu Banilad Campus',
        price: 10500,
        beds: 1,
        baths: 1,
        sizeSqm: 14,
        description: 'Near UC Banilad',
        imageUrls: [],
        saved: false
      }
    ],
    hotspots: [],
    toggleSaved: mockToggleSaved,
    loading: false,
    error: ''
  })
}));

jest.mock('../components/CebuMap', () => () => <div data-testid="cebu-map" />);

import SearchResultsPage from './SearchResultsPage';

const renderSearchResultsPage = () => {
  render(<SearchResultsPage />);
};

test('filters listings by university and resets back to the full results', () => {
  renderSearchResultsPage();

  expect(screen.getByText('CNU Capitol House')).toBeInTheDocument();
  expect(screen.getByText('USC Talamban Home')).toBeInTheDocument();
  expect(screen.getByText('Banilad Study Nest')).toBeInTheDocument();

  const universitySelect = screen.getByRole('combobox', {
    name: /preferred university/i
  });
  fireEvent.change(universitySelect, { target: { value: 'Cebu Normal University' } });
  fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

  expect(screen.getByText('CNU Capitol House')).toBeInTheDocument();
  expect(screen.queryByText('USC Talamban Home')).not.toBeInTheDocument();
  expect(screen.queryByText('Banilad Study Nest')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

  expect(screen.getByText('USC Talamban Home')).toBeInTheDocument();
  expect(screen.getByText('Banilad Study Nest')).toBeInTheDocument();
});

test('saves a listing from the list view', () => {
  renderSearchResultsPage();

  fireEvent.click(screen.getAllByRole('button', { name: /save listing/i })[0]);

  expect(mockToggleSaved).toHaveBeenCalled();
});
