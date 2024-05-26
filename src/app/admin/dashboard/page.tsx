import {
  Eye,
  HandCoins,
  LucideEye,
  LucideHandCoins,
  ShoppingCart,
  Users,
} from 'lucide-react';
import {
  AdminCard,
  AdminSearchbar,
  AdminSession,
  AdminSidebar,
  Separator,
} from '../../_components/_index';

export default function AdminDashboard() {
  return (
    <AdminSession>
      <AdminSidebar />

      <div className='flex flex-col gap-3.5 sm:min-h-[87.5%] sm:min-w-[92.5%] min-w-full min-h-full p-4 md:p-12'>
        <section>
          <h1 className='text-2xl font-semibold'>
            Welcome back insert admin name!
          </h1>
        </section>

        <AdminSearchbar />

        <div className='flex flex-col gap-y-3.5 md:flex-row md:flex-wrap md:justify-between'>
          <AdminCard
            title='insert visitors last 30 days'
            desc='Visitors last 30 days'
            className='md:w-[49%]'
          >
            <Eye aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert register last 30 days'
            desc='New accounts last 30 days'
            className='md:w-[49%]'
          >
            <Users aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert purchases last 30 days'
            desc='Purchases last 30 days'
            className='md:w-[49%]'
          >
            <ShoppingCart aria-hidden />
          </AdminCard>
          <AdminCard
            title='insert profit last 30 days'
            desc='Profit last 30 days'
            className='md:w-[49%]'
          >
            <HandCoins aria-hidden />
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
    </AdminSession>
  );
}
