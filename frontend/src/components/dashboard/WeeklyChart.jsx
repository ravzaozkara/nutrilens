import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Card from '../common/Card';

export default function WeeklyChart({ data = [], target = 1800 }) {
  const chartData = data.map(item => ({
    ...item,
    fill: item.calories > target ? '#ef4444' : item.calories > target * 0.8 ? '#eab308' : '#22c55e',
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalık Özet</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value) => [`${value} kcal`, 'Kalori']}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
            />
            <ReferenceLine
              y={target}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              label={{
                value: 'Hedef',
                position: 'right',
                fill: '#9ca3af',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="calories"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-gray-600">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-gray-600">Hedefe yakın</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-600">Aşıldı</span>
        </div>
      </div>
    </Card>
  );
}
