// Custom types for the chart component
export type ChartDataProps = {
  date?: string;
  'Total New Visitors'?: number;
  'Total New Purchases'?: number;
  'Total Profit'?: number;
  'Total New Accounts'?: number;
};

export type ChartXAxisTickProps = {
  x?: number;
  y?: number;
  payload?: { value: string };
};

export type ChartYAxisTickProps = {
  x?: number;
  y?: number;
  payload?: { value: number };
};
