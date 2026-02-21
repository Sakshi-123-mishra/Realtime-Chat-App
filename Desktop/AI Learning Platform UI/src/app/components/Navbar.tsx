import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logoImage from "@/assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Companions', path: '/build-companion' },
    { label: 'My Journey', path: '/journey' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={logoImage} alt="E learn" className="h-10 w-10 object-contain" />
            <h1 className="text-xl font-bold text-gray-900">
              <span className="text-2xl text-yellow-500">E</span> learn
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-purple-600"></span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile & Upgrade */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => navigate('/upgrade')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Upgrade Plan
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
              title={user?.displayName || user?.email || 'Profile'}
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
