import { Pencil, Trash2 } from 'lucide-react';
import type { AdminUserEditProps } from '../../_types/_index';
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

const AdminUserEditPropsMapped: Record<keyof AdminUserEditProps, string> = {
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

export function AdminEditAction({ user }: { user: AdminUserEditProps }) {
  return (
    <Dialog>
      <DialogTrigger asChild title='Edit'>
        <Button size='icon' className='mr-2.5 rounded-md'>
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
        <div className='grid gap-4 py-4'>
          {Object.entries(user).map(([prop, val], i) => (
            <div key={i} className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor={prop} className='text-right'>
                {AdminUserEditPropsMapped[prop as keyof AdminUserEditProps]}
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
        <Button variant='destructive' size='icon' className='rounded-md'>
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
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
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
