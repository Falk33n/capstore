import { Eye, HandCoins, ShoppingCart, Users } from 'lucide-react';
import {
  AdminAuth,
  AdminCard,
  AdminFullChart,
  AdminHeader,
  AdminSearchbar,
  AdminSidebar,
  Separator
} from '../../../components';

// The main page of the admin route
export default function AdminDashboard() {
  return (
    <AdminAuth>
      <AdminSidebar />

      <div className='flex min-h-full min-w-full flex-col gap-3.5 p-4 sm:min-h-[87.5%] sm:min-w-[92.5%] md:p-12 md:pt-8'>
        <section>
          <AdminHeader />
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
          <div className='md:-mb-5 md:-ml-8 md:flex-1'>
            <AdminFullChart />
          </div>

          <div className='flex flex-col gap-3.5 md:relative md:w-[29rem] md:pl-7'>
            <Separator
              className='hidden md:absolute md:left-1.5 md:top-0 md:block'
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
    </AdminAuth>
  );
}
