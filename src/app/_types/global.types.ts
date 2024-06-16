export type ChartSingleDataProps = {
  dates?: string[];
  totalNewVisitors?: number[];
  totalNewPurchases?: number[];
  totalProfit?: number[];
  totalNewAccounts?: number[];
};

export type ChartAllDataProps = {
  date?: string;
  totalNewVisitors?: number;
  totalNewPurchases?: number;
  totalProfit?: number;
  totalNewAccounts?: number;
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

export type UserRole = 'user' | 'admin' | 'developer' | undefined;
