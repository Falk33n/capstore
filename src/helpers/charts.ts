import type { ChartAllDataProps, ChartSingleDataProps } from '@/types';

export function getAllChartData(): ChartAllDataProps[] {
  const data: ChartAllDataProps[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      totalNewVisitors: Math.floor(Math.random() * 100) + 1,
      totalNewPurchases: Math.floor(Math.random() * 50) + 1,
      totalProfit: Math.floor(Math.random() * 500) + 1,
      totalNewAccounts: Math.floor(Math.random() * 30) + 1
    });
  }

  return data;
}

export function getMonthlyAggregatedData(): ChartSingleDataProps {
  const dates: string[] = [];
  const totalNewVisitors: number[] = [];
  const totalNewPurchases: number[] = [];
  const totalProfit: number[] = [];
  const totalNewAccounts: number[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];

    if (formattedDate) dates.push(formattedDate);

    totalNewVisitors.push(Math.floor(Math.random() * 100) + 1);
    totalNewPurchases.push(Math.floor(Math.random() * 50) + 1);
    totalProfit.push(Math.floor(Math.random() * 500) + 1);
    totalNewAccounts.push(Math.floor(Math.random() * 30) + 1);
  }

  return {
    dates,
    totalNewVisitors,
    totalNewPurchases,
    totalProfit,
    totalNewAccounts
  };
}

export function getTodayChartData(): ChartAllDataProps {
  const today = new Date();
  const date = today.toISOString().split('T')[0];

  return {
    date,
    totalNewVisitors: Math.floor(Math.random() * 100) + 1,
    totalNewPurchases: Math.floor(Math.random() * 50) + 1,
    totalProfit: Math.floor(Math.random() * 500) + 1,
    totalNewAccounts: Math.floor(Math.random() * 30) + 1
  };
}
