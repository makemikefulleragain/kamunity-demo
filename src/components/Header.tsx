'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { cn, a11y } from '@/lib/utils';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/news', label: 'The News' },
    { href: '/chat', label: 'Chat' },
    { href: '/rooms', label: 'Rooms' }
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <Container>
        <nav className="flex items-center justify-between h-16" aria-label={a11y.ariaLabels.navigation}>
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 font-bold text-xl text-primary-600 transition-colors",
              a11y.focusRing
            )}
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="hidden sm:block">Kamunity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-body-base font-medium text-neutral-700 rounded-button transition-all duration-200",
                  "hover:text-primary-600 hover:bg-primary-50",
                  a11y.focusRing
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-button text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors",
              a11y.focusRing
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-neutral-200 bg-white animate-slide-up"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-3 text-body-base font-medium text-neutral-700 rounded-button transition-all duration-200",
                    "hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100",
                    a11y.focusRing
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
