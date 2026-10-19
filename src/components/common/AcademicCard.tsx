import React from 'react';

interface AcademicCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export const AcademicCard: React.FC<AcademicCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  children,
  action,
  className = '',
  highlight = false,
}) => {
  return (
    <div
      className={`academic-card overflow-hidden transition-all duration-200 ${
        highlight ? 'ring-2 ring-emerald-500/20 border-emerald-300' : 'border-slate-200'
      } ${className}`}
    >
      {(title || action || icon || badge) && (
        <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <span className="text-emerald-700 shrink-0">{icon}</span>}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-800 truncate flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};
