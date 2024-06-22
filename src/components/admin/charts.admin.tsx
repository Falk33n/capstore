'use client';

import {
  ChartLegend,
  ChartTooltip,
  ChartXAxisTick,
  ChartYAxisTick
} from '@/components';
import { getAllChartData } from '@/helpers';
import type { ChartAllDataProps } from '@/types';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export function AdminFullChart() {
  const [data, setData] = useState<ChartAllDataProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = getAllChartData();
      setData(data);
    };

    fetchData().catch(console.error);
  }, []);

  // Render a chart to show statistics
  return (
    <ResponsiveContainer width='100%' height={450}>
      <LineChart data={data}>
        <CartesianGrid stroke='#ccc' strokeDasharray='2 2' strokeWidth={1} />
        <XAxis dataKey='date' tick={<ChartXAxisTick />} />
        <YAxis tick={<ChartYAxisTick />} />
        <Tooltip content={<ChartTooltip />} />
        <Legend content={<ChartLegend />} />
        <Line type='monotone' dataKey='Total New Visitors' stroke='#16A34A' />
        <Line type='monotone' dataKey='Total New Purchases' stroke='#1E3A8A' />
        <Line type='monotone' dataKey='Total Profit' stroke='#DC2626' />
        <Line type='monotone' dataKey='Total New Accounts' stroke='#F59E0B' />
      </LineChart>
    </ResponsiveContainer>
  );
}
