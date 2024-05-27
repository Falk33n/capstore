import type { ChartDataProps } from '../_types/all.types';

// Helper function to get chart data
export function getChartData(): ChartDataProps[] {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      'Total New Visitors': Math.floor(Math.random() * 100) + 1,
      'Total New Purchases': Math.floor(Math.random() * 50) + 1,
      'Total Profit': Math.floor(Math.random() * 500) + 1,
      'Total New Accounts': Math.floor(Math.random() * 30) + 1,
    });
  }
  return data;
}
