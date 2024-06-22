import {
  AdminAuth,
  AdminUserActions,
  Menubar,
  MenubarMenu,
  MenubarTrigger
} from '../../../components';

export default function AdminActions() {
  return (
    <AdminAuth>
      <div className='my-28 flex w-[90%] flex-col items-center gap-7 sm:w-[75%] lg:max-w-[1400px]'>
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
