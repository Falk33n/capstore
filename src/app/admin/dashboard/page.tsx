import { Eye, HandCoins, ShoppingCart, Users } from 'lucide-react';
import { CartesianGrid, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AdminCard,
  AdminChart,
  AdminSearchbar,
  AdminSession,
  AdminSidebar,
  ChartLegend,
  ChartTooltip,
  ChartXAxisTick,
  ChartYAxisTick,
  Separator,
} from '../../_components/_index';
import { getChartData } from '../../_helpers/_index';

// The main page of the admin route
export default function AdminDashboard() {
  return (
    <AdminSession>
      <AdminSidebar />

      <div className='flex flex-col gap-3.5 sm:min-h-[87.5%] sm:min-w-[92.5%] min-w-full min-h-full p-4 md:p-12'>
        <section>
          <h1 className='text-2xl font-bold'>
            Welcome back insert admin name!
          </h1>
        </section>

        <AdminSearchbar />

        <div className='flex flex-col gap-y-3.5 md:flex-row md:flex-wrap md:justify-between'>
          <AdminCard
            title='insert active today'
            desc='Total visitors today'
            className='md:w-[49%]'
          >
            <Eye aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert register today'
            desc='Total new accounts today'
            className='md:w-[49%]'
          >
            <Users aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert purchases today'
            desc='Total purchases today'
            className='md:w-[49%]'
          >
            <ShoppingCart aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert profit today'
            desc='Total profit today'
            className='md:w-[49%]'
          >
            <HandCoins aria-hidden />
          </AdminCard>
        </div>

        <Separator className='my-3.5' />

        <div className='flex flex-col gap-3.5 md:flex-row md:items-center'>
          <AdminChart getChartData={getChartData}>
            <CartesianGrid
              stroke='#ccc'
              strokeDasharray='2 2'
              strokeWidth={1}
            />
            <XAxis dataKey='date' tick={<ChartXAxisTick />} />
            <YAxis tick={<ChartYAxisTick />} />
            <Tooltip content={<ChartTooltip />} />
            <Legend content={<ChartLegend />} />
            <Line
              type='monotone'
              dataKey='Total New Visitors'
              stroke='#16A34A'
            />
            <Line
              type='monotone'
              dataKey='Total New Purchases'
              stroke='#1E3A8A'
            />
            <Line type='monotone' dataKey='Total Profit' stroke='#DC2626' />
            <Line
              type='monotone'
              dataKey='Total New Accounts'
              stroke='#F59E0B'
            />
          </AdminChart>

          <div className='flex flex-col gap-3.5 md:w-[29rem] md:pl-7 md:relative'>
            <Separator
              className='hidden md:block md:absolute md:left-1.5 md:top-0'
              orientation='vertical'
            />

            <AdminCard
              title='insert visitors last 30 days'
              desc='Total visitors last 30 days'
            >
              <Eye aria-hidden />
            </AdminCard>
            <AdminCard
              title='insert register last 30 days'
              desc='Total new accounts last 30 days'
            >
              <Users aria-hidden />
            </AdminCard>
            <AdminCard
              title='insert purchases last 30 days'
              desc='Total purchases last 30 days'
            >
              <ShoppingCart aria-hidden />
            </AdminCard>
            <AdminCard
              title='insert profit last 30 days'
              desc='Total profit last 30 days'
            >
              <HandCoins aria-hidden />
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminSession>
  );
}
