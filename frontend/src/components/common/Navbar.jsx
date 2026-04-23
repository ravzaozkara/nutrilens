import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { clsx } from 'clsx';
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  CameraIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: HomeIcon },
    { name: 'Geçmiş', path: '/history', icon: ClockIcon },
    { name: 'Profil', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">NutriLens</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/analysis"
              className="ml-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <CameraIcon className="w-4 h-4" />
              Analiz Et
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Menu as="div" className="relative sm:hidden">
              <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 focus:outline-none">
                  {navLinks.map((link) => (
                    <Menu.Item key={link.path}>
                      {({ active }) => (
                        <Link
                          to={link.path}
                          className={clsx(
                            'flex items-center gap-2 px-4 py-2 text-sm',
                            active ? 'bg-gray-50' : '',
                            location.pathname === link.path
                              ? 'text-primary-600'
                              : 'text-gray-700'
                          )}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/analysis"
                        className={clsx(
                          'flex items-center gap-2 px-4 py-2 text-sm text-primary-600',
                          active ? 'bg-gray-50' : ''
                        )}
                      >
                        <CameraIcon className="w-5 h-5" />
                        Analiz Et
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User Avatar Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={clsx(
                          'block px-4 py-2 text-sm text-gray-700',
                          active ? 'bg-gray-50' : ''
                        )}
                      >
                        Profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={clsx(
                          'w-full text-left px-4 py-2 text-sm text-red-600',
                          active ? 'bg-gray-50' : ''
                        )}
                      >
                        Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
