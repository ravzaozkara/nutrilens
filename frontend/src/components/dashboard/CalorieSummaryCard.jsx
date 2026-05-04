import Card from '../common/Card';

export default function CalorieSummaryCard({ consumed = 0, target = 1800 }) {
  const safeTarget = target > 0 ? target : 1800;
  const percentage = Math.min(100, (consumed / safeTarget) * 100);
  const remaining = safeTarget - consumed;
  const isOver = remaining < 0;

  const getColor = () => {
    if (percentage <= 80) return { stroke: '#22c55e', bg: 'text-green-600' };
    if (percentage <= 100) return { stroke: '#eab308', bg: 'text-yellow-600' };
    return { stroke: '#ef4444', bg: 'text-red-600' };
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Calories</h3>

      {/* Circular Progress */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={color.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">
            {consumed.toLocaleString('en-US')}
          </span>
          <span className="text-gray-500">/ {target.toLocaleString('en-US')} kcal</span>
        </div>
      </div>

      {/* Status text */}
      <p className={`mt-4 font-medium ${color.bg}`}>
        {isOver
          ? `${Math.abs(remaining).toLocaleString('en-US')} calories over`
          : `${remaining.toLocaleString('en-US')} calories remaining`}
      </p>
    </Card>
  );
}
