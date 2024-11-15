// src/components/ui/Menu.tsx
import React, { useState } from 'react';

export const Menu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

export const MenuButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
      {children}
    </button>
  );
};

export const MenuItems = ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => {
  return (
    isOpen && (
      <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {children}
        </div>
      </div>
    )
  );
};

export const MenuItem = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <div onClick={onClick} className="cursor-pointer hover:bg-gray-100 p-2" role="menuitem">
      {children}
    </div>
  );
};