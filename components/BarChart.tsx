import React from 'react';

interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
  unit?: string;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, unit = '' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="flex items-center group">
              <div className="w-1/3 text-sm text-gray-600 dark:text-gray-400 truncate pr-2" title={item.label}>
                {item.label}
              </div>
              <div className="w-2/3 flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 flex items-center">
                  <div
                    className="bg-blue-500 h-6 rounded-full text-xs font-medium text-blue-100 text-center p-1 leading-none transition-all duration-500 ease-out"
                    style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity pl-2">{item.value} {unit}</span>
                  </div>
                </div>
                 <div className="w-16 text-right pl-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item.value} {unit}
                </div>
              </div>
            </div>
          ))
        ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default BarChart;
