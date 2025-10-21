'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coins, Home, MessageSquarePlus, Trophy, Wallet, LogOut, ShoppingCart, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, [pathname]);

  async function loadUser() {
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const isActive = (path) => pathname === path;

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-2xl font-bold text-gray-900">AskEarn</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink href="/" icon={Home} label="Home" active={isActive('/')} />
            <NavLink href="/ask" icon={MessageSquarePlus} label="Ask Question" active={isActive('/ask')} />
            <NavLink href="/leaderboard" icon={Trophy} label="Leaderboard" active={isActive('/leaderboard')} />
            <NavLink href="/wallet" icon={Wallet} label="Wallet" active={isActive('/wallet')} />
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/buy-coins" className="btn-secondary flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline">Buy Coins</span>
                </Link>
                <div className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-lg">
                  <Coins className="w-5 h-5 text-gray-900" />
                  <span className="font-bold text-gray-900">{user.coins}</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                    title="Admin Panel"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon: Icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary text-gray-900 font-semibold'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
