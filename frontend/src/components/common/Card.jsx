import { clsx } from 'clsx';

export default function Card({ children, className, padding = 'md', ...props }) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
