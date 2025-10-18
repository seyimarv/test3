import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tasks', icon: ClipboardList },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm mb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Taskstream</span>
          </div>

          <div className="flex gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  location.pathname === path
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
