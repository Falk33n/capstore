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
  // Sidebar for the admin panel with a button to hide/show it
  return (
    <Drawer direction='left'>
      <DrawerTrigger
        asChild
        className='fixed top-[100rem] md:top-1/2 -translate-y-1/2 left-3'
      >
        <Button
          variant='icon'
          className='h-20 w-2 rounded-full bg-muted-foreground/20'
          size='icon'
          aria-label='Open sidebar'
          title='Open Sidebar'
        />
      </DrawerTrigger>
      <DrawerContent className='py-4 px-7'>
        <DrawerClose
          asChild
          className='absolute top-1/2 -translate-y-1/2 right-3'
        >
          <Button
            variant='icon'
            className='h-20 w-2 rounded-full bg-muted-foreground/20'
            size='icon'
            aria-label='Open sidebar'
            title='Open Sidebar'
          />
        </DrawerClose>
        <div className='flex-1 flex flex-col w-full'>
          <DrawerHeader>
            <DrawerTitle className='text-center text-lg'>
              Admin Navigation
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col items-center justify-center w-full gap-5 pt-1.5'>
            <Link
              href='/admin/dashboard'
              className='font-medium text-base text-foreground w-full px-8 flex items-center justify-between bg-muted rounded-lg whitespace-nowrap py-3 transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Dashboard
              <LayoutDashboard className='size-5' />
            </Link>
            <Link
              href='/admin/commands'
              className='font-medium text-base text-foreground w-full px-8 flex items-center justify-between bg-muted rounded-lg whitespace-nowrap py-3 transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Admin Commands
              <ShieldEllipsis className='size-5' />
            </Link>
            <Link
              href='/admin/statistics'
              className='font-medium text-base text-foreground px-8 w-full flex items-center justify-between bg-muted rounded-lg py-3 transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Statistics
              <BarChartHorizontalBig className='size-5' />
            </Link>
            <Link
              href='/admin/logs'
              className='font-medium text-base text-foreground px-8 w-full flex items-center justify-between bg-muted rounded-lg py-3 transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
            >
              Logs
              <FileSliders className='size-5' />
            </Link>
          </div>
          <DrawerFooter className='w-full px-0'>
            <Link
              href='/'
              className='font-medium text-foreground flex items-center justify-between bg-muted rounded-lg px-8 py-3 transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white'
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
