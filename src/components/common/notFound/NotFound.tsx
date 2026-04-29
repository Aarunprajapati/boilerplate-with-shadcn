// src/components/NotFound.tsx
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600">Oops! The page you are looking for does not exist.</p>
      <p className="mb-6 text-xl text-gray-600">
        Try Hard Refreshing the page (<kbd>Ctrl + Shift + r</kbd>) or try again later.
      </p>
      <button
        onClick={() => navigate('/')}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
