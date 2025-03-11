
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path ? 
      "border-indigo-500 text-gray-900" : 
      "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Product Manager</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/" 
                  className={`${isActive('/')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Products
                </Link>
                <Link 
                  to="/categories" 
                  className={`${isActive('/categories')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navigation for smaller screens */}
      <div className="sm:hidden bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-500'} flex-1 text-center py-3`}
          >
            Products
          </Link>
          <Link 
            to="/categories" 
            className={`${location.pathname === '/categories' ? 'text-indigo-600' : 'text-gray-500'} flex-1 text-center py-3`}
          >
            Categories
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
