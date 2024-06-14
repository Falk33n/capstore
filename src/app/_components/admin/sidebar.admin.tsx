import {
  BarChartHorizontalBig,
  FileSliders,
  Home,
  LayoutDashboard,
  ShieldEllipsis,
} from 'lucide-react';
import Link from 'next/link';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../_index';

export function AdminSidebar() {
  return (
    <Drawer direction='left'>
      <DrawerTrigger
        asChild
        className='top-[100rem] md:top-1/2 left-3 fixed -translate-y-1/2'
      >
        <Button
          variant='icon'
          className='bg-muted-foreground/20 rounded-full w-2 h-20'
          size='icon'
          aria-label='Open sidebar'
          title='Open Sidebar'
        />
      </DrawerTrigger>
      <DrawerContent className='px-7 py-4'>
        <DrawerClose
          asChild
          className='top-1/2 right-3 absolute -translate-y-1/2'
        >
          <Button
            variant='icon'
            className='bg-muted-foreground/20 rounded-full w-2 h-20'
            size='icon'
            aria-label='Open sidebar'
            title='Open Sidebar'
          />
        </DrawerClose>
        <div className='flex flex-col flex-1 w-full'>
          <DrawerHeader>
            <DrawerTitle className='text-center text-lg'>
              Admin Navigation
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col justify-center items-center gap-5 pt-1.5 w-full'>
            <Link
              href='/admin/dashboard'
              className='flex justify-between items-center bg-muted hover:bg-primary focus-visible:bg-primary px-8 py-3 rounded-lg w-full font-medium text-base text-foreground hover:text-white focus-visible:text-white whitespace-nowrap transition-colors'
            >
              Dashboard
              <LayoutDashboard className='size-5' />
            </Link>
            <Link
              href='/admin/commands'
              className='flex justify-between items-center bg-muted hover:bg-primary focus-visible:bg-primary px-8 py-3 rounded-lg w-full font-medium text-base text-foreground hover:text-white focus-visible:text-white whitespace-nowrap transition-colors'
            >
              Admin Commands
              <ShieldEllipsis className='size-5' />
            </Link>
            <Link
              href='/admin/statistics'
              className='flex justify-between items-center bg-muted hover:bg-primary focus-visible:bg-primary px-8 py-3 rounded-lg w-full font-medium text-base text-foreground hover:text-white focus-visible:text-white transition-colors'
            >
              Statistics
              <BarChartHorizontalBig className='size-5' />
            </Link>
            <Link
              href='/admin/logs'
              className='flex justify-between items-center bg-muted hover:bg-primary focus-visible:bg-primary px-8 py-3 rounded-lg w-full font-medium text-base text-foreground hover:text-white focus-visible:text-white transition-colors'
            >
              Logs
              <FileSliders className='size-5' />
            </Link>
          </div>
          <DrawerFooter className='px-0 w-full'>
            <Link
              href='/'
              className='flex justify-between items-center bg-muted hover:bg-primary focus-visible:bg-primary px-8 py-3 rounded-lg font-medium text-foreground hover:text-white focus-visible:text-white transition-colors'
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
