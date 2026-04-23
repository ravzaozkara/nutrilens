import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Sayfa Bulunamadı
        </h2>
        <p className="mt-2 text-gray-600">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
