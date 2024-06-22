import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components';
import {
  BarChartHorizontalBig,
  FileSliders,
  Home,
  LayoutDashboard,
  ShieldEllipsis
} from 'lucide-react';
import Link from 'next/link';

export function AdminSidebar() {
  return (
    <Drawer direction='left'>
      <DrawerTrigger
        asChild
        className='fixed left-3 top-[100rem] -translate-y-1/2 md:top-1/2'
      >
        <Button
          variant='icon'
          className='h-20 w-2 rounded-full bg-muted-foreground/20'
          size='icon'
          aria-label='Open sidebar'
          title='Open Sidebar'
        />
      </DrawerTrigger>
      <DrawerContent className='px-7 py-4'>
        <DrawerClose
          asChild
          className='absolute right-3 top-1/2 -translate-y-1/2'
        >
          <Button
            variant='icon'
            className='h-20 w-2 rounded-full bg-muted-foreground/20'
            size='icon'
            aria-label='Open sidebar'
            title='Open Sidebar'
          />
        </DrawerClose>
        <div className='flex w-full flex-1 flex-col'>
          <DrawerHeader>
            <DrawerTitle className='text-center text-lg'>
              Admin Navigation
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex w-full flex-col items-center justify-center gap-5 pt-1.5'>
            <Link
              href='/admin/dashboard'
              className='flex w-full items-center justify-between whitespace-nowrap rounded-lg bg-muted px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Dashboard
              <LayoutDashboard className='size-5' />
            </Link>
            <Link
              href='/admin/commands'
              className='flex w-full items-center justify-between whitespace-nowrap rounded-lg bg-muted px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Admin Commands
              <ShieldEllipsis className='size-5' />
            </Link>
            <Link
              href='/admin/statistics'
              className='flex w-full items-center justify-between rounded-lg bg-muted px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Statistics
              <BarChartHorizontalBig className='size-5' />
            </Link>
            <Link
              href='/admin/logs'
              className='flex w-full items-center justify-between rounded-lg bg-muted px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Logs
              <FileSliders className='size-5' />
            </Link>
          </div>
          <DrawerFooter className='w-full px-0'>
            <Link
              href='/'
              className='flex items-center justify-between rounded-lg bg-muted px-8 py-3 font-medium text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Home
              <Home aria-hidden className='size-5' />
            </Link>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
