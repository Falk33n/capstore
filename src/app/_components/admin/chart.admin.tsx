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

type VisitorData = {
  date?: string;
  Visitors: number;
};

const generateMockData = (): VisitorData[] => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      Visitors: Math.floor(Math.random() * 100) + 1,
    });
  }
  return data;
};

export function AdminChart() {
  const [data, setData] = useState<VisitorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = generateMockData();
      setData(data);
    };

    fetchData().catch(console.error);
  }, []);

  // Render a chart to show statistics
  return (
    <ResponsiveContainer
      className='md:flex-1 md:-ml-8'
      width='100%'
      height={450}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='5 5' />
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='Visitors' stroke='#16A34A' />
      </LineChart>
    </ResponsiveContainer>
  );
}
