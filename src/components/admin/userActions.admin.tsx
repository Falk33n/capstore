'use client';

import {
  AdminDeleteAction,
  AdminEditAction,
  AdminSortButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components';
import { sortUsers } from '@/helpers';
import { api } from '@/trpc';
import type {
  AdminEditProps,
  AdminSortUserArrayProps,
  AdminSortUserCategoryProps
} from '@/types';
import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';

const emptyUser: AdminEditProps = {
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  postalCode: '',
  address: '',
  email: '',
  role: ''
};

const userSortValues: AdminSortUserCategoryProps = {
  email: 'unsorted',
  fullName: 'unsorted',
  fullAddress: 'unsorted',
  role: 'unsorted'
};

export function AdminUserActions() {
  const getAllUsers = api.userGet.getAllUsers.useQuery(undefined, {
    retry: false
  });

  const [userSortOrder, setUserSortOrder] = useState(userSortValues);
  const [users, setUsers] = useState<AdminSortUserArrayProps>({
    original: [],
    sorted: []
  });

  useEffect(() => {
    if (!getAllUsers.data) return;
    else {
      const usersArray: AdminEditProps[] = [];
      getAllUsers.data.forEach(user => {
        if (user) {
          usersArray.push({
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country,
            city: user.city,
            postalCode: user.postalCode,
            address: user.address,
            email: user.email,
            role: user.role
          });
        }
      });

      while (usersArray.length < 13) {
        usersArray.push({ ...emptyUser });
      }

      setUsers({ original: usersArray, sorted: usersArray });
    }
  }, [getAllUsers.data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='relative border-r text-start'>
            Email Address
            <AdminSortButton
              sortKey='email'
              label='Email Address'
              userSortOrder={userSortOrder}
              onClick={() =>
                sortUsers(
                  'email',
                  userSortOrder,
                  setUserSortOrder,
                  users,
                  setUsers
                )
              }
            />
          </TableHead>
          <TableHead className='relative border-r text-start'>
            Full Name
            <AdminSortButton
              sortKey='fullName'
              label='Last Name'
              userSortOrder={userSortOrder}
              onClick={() =>
                sortUsers(
                  'fullName',
                  userSortOrder,
                  setUserSortOrder,
                  users,
                  setUsers
                )
              }
            />
          </TableHead>
          <TableHead className='relative border-r text-start'>
            Full Address
            <AdminSortButton
              sortKey='fullAddress'
              label='Country'
              userSortOrder={userSortOrder}
              onClick={() =>
                sortUsers(
                  'fullAddress',
                  userSortOrder,
                  setUserSortOrder,
                  users,
                  setUsers
                )
              }
            />
          </TableHead>
          <TableHead className='relative border-r text-start'>
            Role
            <AdminSortButton
              sortKey='role'
              label='Role'
              userSortOrder={userSortOrder}
              onClick={() =>
                sortUsers(
                  'role',
                  userSortOrder,
                  setUserSortOrder,
                  users,
                  setUsers
                )
              }
            />
          </TableHead>
          <TableHead className='text-center'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.sorted.map((user, i) => (
          <TableRow key={i}>
            <TableCell
              title={user.email}
              className='max-w-[400px] truncate border-r'
            >
              {user.email}
            </TableCell>
            <TableCell
              title={`${user.firstName} ${user.lastName}`}
              className='max-w-[200px] truncate border-r'
            >
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell
              title={
                user.email === ''
                  ? ''
                  : `${user.address}, ${user.postalCode}, ${user.city}, ${user.country}`
              }
              className='max-w-[400px] truncate border-r'
            >
              {user.email === ''
                ? ''
                : `${user.address}, ${user.postalCode}, ${user.city}, ${user.country}`}
            </TableCell>
            <TableCell className='max-w-[100px] border-r'>
              {user.email === '' ? '' : user.role}
            </TableCell>
            <TableCell className='max-w-[300px] text-center'>
              {user.email === '' && (
                <span aria-hidden className='invisible'>
                  .
                </span>
              )}
              {user.email !== '' && (
                <>
                  <AdminEditAction user={user} />
                  <AdminDeleteAction email={user.email} />
                  <Button
                    variant='secondary'
                    size='icon'
                    title='Orders'
                    className='ml-2.5 rounded-md'
                  >
                    <ClipboardList className='size-full' />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
