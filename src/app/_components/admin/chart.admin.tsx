'use client';

import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../_index';

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
    <div className='md:flex-1 md:-ml-8 md:relative'>
      <ResponsiveContainer width='100%' height={450}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='5 5' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Line type='monotone' dataKey='Visitors' stroke='#16A34A' />
        </LineChart>
      </ResponsiveContainer>

      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select a statistic' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Statistics last 30 days</SelectLabel>
            <SelectItem value='visitors'>Visitors</SelectItem>
            <SelectItem value='accounts'>New Accounts</SelectItem>
            <SelectItem value='purchases'>Purchases</SelectItem>
            <SelectItem value='profit'>Profit</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
