'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { LineChart, ResponsiveContainer } from 'recharts';
import type { ChartDataProps } from '../../_types/all.types';

export function AdminChart({
  children,
  getChartData,
}: {
  children?: ReactNode;
  getChartData: () => ChartDataProps[];
}) {
  const [data, setData] = useState<ChartDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = getChartData();
      setData(data);
    };

    fetchData().catch(console.error);
  }, [getChartData]);

  // Render a chart to show statistics
  return (
    <div className='md:flex-1 md:-ml-8 md:-mb-10'>
      <ResponsiveContainer width='100%' height={380}>
        <LineChart data={data}>{children}</LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/*           <CartesianGrid stroke='#ccc' strokeDasharray='2 2' strokeWidth={1} />
          <XAxis dataKey='date' tick={<CustomTick />} />
          <YAxis tick={<CustomYAxisTick />} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line type='monotone' dataKey='Total New Visitors' stroke='#16A34A' />
          <Line
            type='monotone'
            dataKey='Total New Purchases'
            stroke='#1E3A8A'
          />
          <Line type='monotone' dataKey='Total Profit' stroke='#DC2626' />
          <Line type='monotone' dataKey='Total New Accounts' stroke='#F59E0B' /> */
