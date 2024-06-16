import {
  AdminAuth,
  AdminUserActions,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from '../../_components/_index';

export default function AdminActions() {
  return (
    <AdminAuth>
      <div className='flex flex-col items-center gap-7 mt-28 min-w-[90%] sm:min-w-[75%] lg:min-w-[900px] h-full'>
        <Menubar className='w-fit'>
          <MenubarMenu>
            <MenubarTrigger>Users</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Orders</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Products</MenubarTrigger>
          </MenubarMenu>
        </Menubar>

        <AdminUserActions />
      </div>
    </AdminAuth>
  );
}
