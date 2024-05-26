import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
        className='fixed top-1/2 -translate-y-1/2 -left-0.5'
      >
        <Button
          variant='icon'
          size='icon'
          aria-label='Open sidebar'
          title='Open Sidebar'
        >
          <span
            aria-hidden
            className='bg-muted-foreground/20 h-20 w-2 rounded-xl'
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose
          asChild
          className='absolute top-1/2 -translate-y-1/2 -right-0.5'
        >
          <Button
            variant='icon'
            size='icon'
            aria-label='Open sidebar'
            title='Open Sidebar'
          >
            <span
              aria-hidden
              className='h-20 w-2 rounded-full bg-muted-foreground/20'
            />
          </Button>
        </DrawerClose>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className='p-4 pb-0'>
            <div className='flex items-center justify-center space-x-2'>
              <div className='flex-1 text-center'>
                <div className='text-[0.70rem] uppercase text-muted-foreground'>
                  Calories/day
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
