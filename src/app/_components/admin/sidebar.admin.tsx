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
  // Sidebar for the admin panel with a button to hide/show it
  return (
    <Drawer direction='left'>
      <DrawerTrigger
        asChild
        className='fixed top-[100rem] md:top-1/2 -translate-y-1/2 -left-0.5'
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
          className='absolute top-1/2 -translate-y-1/2 right-0'
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
            <DrawerTitle>yo man</DrawerTitle>
            <DrawerDescription>hi</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>home</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
