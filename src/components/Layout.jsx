import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, userProfile, pageTitle, pageCategory = "Pages" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="m-0 font-sans text-base antialiased font-normal leading-default bg-gray-50 text-slate-500">
      {/* Sidebar */}
      <Sidebar 
        userProfile={userProfile} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200">
        {/* Mobile menu button */}
        <button
          className="xl:hidden p-2 text-slate-500 hover:text-slate-700 m-6"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Header */}
        <Header 
          userProfile={userProfile}
          pageTitle={pageTitle}
          pageCategory={pageCategory}
        />

        {/* Page Content */}
        <div className="w-full px-6 py-6 mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;