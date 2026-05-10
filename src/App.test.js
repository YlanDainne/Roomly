import { render, screen } from '@testing-library/react';
jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    session: null,
    loading: false,
    supabaseConfigured: false
  })
}));

import LandingPage from './pages/LandingPage';

test('renders the landing page', () => {
  render(<LandingPage />);

  expect(screen.getByRole('button', { name: /start searching/i })).toBeInTheDocument();
});
