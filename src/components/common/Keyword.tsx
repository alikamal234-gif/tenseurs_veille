import React from 'react';

interface KeywordProps {
  id: string;
  children: React.ReactNode;
  onSelect: (id: string) => void;
  className?: string;
}

export const Keyword: React.FC<KeywordProps> = ({ id, children, onSelect, className = '' }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      className={`inline-flex items-center text-emerald-800 hover:text-emerald-950 border-b-2 border-dashed border-emerald-500 hover:border-emerald-700 transition-all font-semibold cursor-pointer px-1 py-0.5 rounded-xs hover:bg-emerald-50 ${className}`}
      title="Cliquer pour afficher la définition"
    >
      {children}
    </button>
  );
};
