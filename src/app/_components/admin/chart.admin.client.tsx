'use client';

import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getChartData } from '../../_helpers/_index';
import type { ChartDataProps } from '../../_types/_index';
import {
  ChartLegend,
  ChartTooltip,
  ChartXAxisTick,
  ChartYAxisTick,
} from '../_index';

export function AdminChart() {
  const [data, setData] = useState<ChartDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = getChartData();
      setData(data);
    };

    fetchData().catch(console.error);
  }, []);

  // Render a chart to show statistics
  return (
    <div className='md:flex-1 md:-ml-8 md:-mb-5'>
      <ResponsiveContainer width='100%' height={450}>
        <LineChart data={data}>
          <CartesianGrid stroke='#ccc' strokeDasharray='2 2' strokeWidth={1} />
          <XAxis dataKey='date' tick={<ChartXAxisTick />} />
          <YAxis tick={<ChartYAxisTick />} />
          <Tooltip content={<ChartTooltip />} />
          <Legend content={<ChartLegend />} />
          <Line type='monotone' dataKey='Total New Visitors' stroke='#16A34A' />
          <Line
            type='monotone'
            dataKey='Total New Purchases'
            stroke='#1E3A8A'
          />
          <Line type='monotone' dataKey='Total Profit' stroke='#DC2626' />
          <Line type='monotone' dataKey='Total New Accounts' stroke='#F59E0B' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
