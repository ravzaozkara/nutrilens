import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const variants = {
  success: {
    container: 'bg-green-50 border-green-500',
    icon: CheckCircleIcon,
    iconColor: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-500',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
  },
  error: {
    container: 'bg-red-50 border-red-500',
    icon: XCircleIcon,
    iconColor: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-500',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
  },
};

export default function Alert({ variant = 'info', title, message, className }) {
  const styles = variants[variant];
  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        'rounded-xl border-l-4 p-4',
        styles.container,
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx('h-5 w-5', styles.iconColor)} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={clsx('text-sm font-medium', styles.title)}>
              {title}
            </h3>
          )}
          {message && (
            <p className={clsx('text-sm', styles.message, title && 'mt-1')}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
