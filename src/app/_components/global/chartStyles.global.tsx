'use client';

import type { LegendProps, TooltipProps } from 'recharts';
import type {
  ChartXAxisTickProps,
  ChartYAxisTickProps,
} from '../../_types/_index';

export function ChartXAxisTick({ x, y, payload }: ChartXAxisTickProps) {
  return (
    <text x={x} y={y! + 17} fill='#666' fontWeight='600' textAnchor='middle'>
      {payload!.value}
    </text>
  );
}

export function ChartYAxisTick({ x, y, payload }: ChartYAxisTickProps) {
  return (
    <text x={x! - 10} y={y} fill='#666' fontWeight='600' textAnchor='end'>
      {payload!.value}
    </text>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload?.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '10px',
        }}
      >
        <p
          className='label'
          style={{ fontWeight: '600', marginBottom: '5px' }}
        >{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, marginBottom: '5px' }}>
            {entry.name}:{' '}
            {entry.name === 'Total Profit' ? `$${entry.value}` : entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

export function ChartLegend(props: LegendProps) {
  const { payload } = props;
  return (
    <div
      className='custom-legend'
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: '10px 0',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      {payload?.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: entry.color,
              marginRight: '5px',
              borderRadius: '10px',
            }}
          />
          <span style={{ fontWeight: '600' }}>{entry.value}</span>{' '}
        </div>
      ))}
    </div>
  );
}
