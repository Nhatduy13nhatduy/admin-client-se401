'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Replace random data with fixed values
const data = [
  {
    name: 'T1',
    total: 2500,
  },
  {
    name: 'T2',
    total: 3200,
  },
  {
    name: 'T3',
    total: 2800,
  },
  {
    name: 'T4',
    total: 4100,
  },
  {
    name: 'T5',
    total: 3800,
  },
  {
    name: 'T6',
    total: 4300,
  },
  {
    name: 'T7',
    total: 5100,
  },
  {
    name: 'T8',
    total: 4800,
  },
  {
    name: 'T9',
    total: 5300,
  },
  {
    name: 'T10',
    total: 4900,
  },
  {
    name: 'T11',
    total: 5600,
  },
  {
    name: 'T12',
    total: 6200,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Tooltip
          formatter={(value: number) => [
            `${value.toLocaleString()}đ`,
            'Doanh thu',
          ]}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Bar
          dataKey="total"
          fill="#4880FF"
          radius={[4, 4, 0, 0]}
          className="hover:opacity-80"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
