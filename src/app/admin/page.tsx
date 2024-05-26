import {
  LucideEye,
  LucideHandCoins,
  LucideShoppingCart,
  LucideUsers,
} from 'lucide-react';
import { AdminCard, AdminCheck, Separator } from '../_components';

export default function Admin() {
  return (
    <AdminCheck>
      <div className='flex flex-col gap-3.5 sm:min-h-[87.5%] sm:min-w-[92.5%] min-w-full min-h-full px-4 py-8'>
        <section className='mb-3.5 mt-8'>
          <h1 className='text-2xl font-semibold'>
            Welcome back insert admin name!
          </h1>
        </section>
        <div className='flex flex-col gap-3.5'>
          <AdminCard
            title='insert visitors last 30 days'
            desc='Visitors last 30 days'
          >
            <LucideEye aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert register last 30 days'
            desc='New accounts last 30 days'
          >
            <LucideUsers aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert purchases last 30 days'
            desc='Purchases last 30 days'
          >
            <LucideShoppingCart aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert profit last 30 days'
            desc='Profit last 30 days'
          >
            <LucideHandCoins aria-hidden />
          </AdminCard>
        </div>

        <Separator className='my-3.5' />

        <div className='flex flex-col gap-3.5'>
          <AdminCard title='insert active today' desc='Visitors today'>
            <LucideEye aria-hidden />
          </AdminCard>
          <AdminCard title='insert profit today' desc='Profit today'>
            <LucideHandCoins aria-hidden />
          </AdminCard>
        </div>
      </div>
    </AdminCheck>
  );
}
