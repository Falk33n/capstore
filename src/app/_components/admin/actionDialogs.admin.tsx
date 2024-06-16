import { Pencil, Trash2 } from 'lucide-react';
import type { UserTableProps } from '../../_types/_index';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label
} from '../_index';

const userTablePropsMapped: Record<keyof UserTableProps, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  country: 'Country',
  city: 'City',
  postalCode: 'Postal Code',
  address: 'Address',
  email: 'Email',
  admin: 'Admin',
  developer: 'Developer'
};

export function AdminEditAction({ user }: { user: UserTableProps }) {
  return (
    <Dialog>
      <DialogTrigger asChild title='Edit'>
        <Button className='mr-2.5 p-1.5 rounded-md size-7'>
          <Pencil className='size-full' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user profile here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className='gap-4 grid py-4'>
          {Object.entries(user).map(([prop, val], i) => (
            <div key={i} className='items-center gap-4 grid grid-cols-4'>
              <Label htmlFor={prop} className='text-right'>
                {userTablePropsMapped[prop as keyof UserTableProps]}
              </Label>
              <Input
                id={prop}
                defaultValue={val.toString()}
                className='col-span-3'
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type='submit'>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminDeleteAction({ email }: { email: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild title='Delete'>
        <Button variant='destructive' className='p-1.5 rounded-md size-7'>
          <Trash2 className='size-full' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            account and remove the data from the servers.
          </DialogDescription>
        </DialogHeader>
        <div className='gap-4 grid py-4'>
          <div className='items-center gap-4 grid grid-cols-4'>
            <Label htmlFor='email' className='text-right'>
              Email Address
            </Label>
            <Input
              id='email'
              defaultValue={email}
              disabled
              aria-disabled
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' variant='destructive'>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}