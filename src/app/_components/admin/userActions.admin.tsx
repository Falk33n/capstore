'use client';

import { useEffect, useState } from 'react';
import {
  AdminDeleteAction,
  AdminEditAction,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  api
} from '../_index';
import type { UserTableProps } from '../../_types/_index';

export function AdminUserActions() {
  /*   const [user, setUser] = useState(userDetails());
  const router = useRouter();
  const { toast } = useToast();

  const handleCompletion = (isError: boolean, successMsg?: string) => {
    if (isError) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Something went wrong, please try again',
      });
      return false;
    }

    router.refresh();
    setUser(userDetails());
    toast({
      variant: 'success',
      title: 'Success!',
      description: successMsg,
    });
    return true;
  };

  const createUser = api.userCreate.createUser.useMutation({
    onError: () => {
      handleCompletion(true);
    },
    onSuccess: () => {
      handleCompletion(false, 'User created successfully');
    },
  });
  const removeUser = api.userRemove.removeUserAsAdmin.useMutation({
    onError: () => {
      handleCompletion(true);
    },
    onSuccess: () => {
      handleCompletion(false, 'User removed successfully');
    },
  });
  const editUser = api.userEdit.editUser.useMutation({
    onError: () => {
      handleCompletion(true);
    },
    onSuccess: () => {
      handleCompletion(false, 'User updated successfully');
    },
  });
  const getUserByEmail = api.userGet.getUserByEmail.useQuery(
    { email: user.email },
    { enabled: false, retry: false },
  );
  const getUserById = api.userGet.getUserById.useQuery(
    { id: user.id },
    { enabled: false, retry: false },
  );

  const handleSubmit = async () => {
    switch (actionType) {
      case 'create':
        createUser.mutate(user);
        break;
      case 'remove':
        removeUser.mutate({ email: user.email });
        break;
      case 'edit':
        editUser.mutate(user);
        break;
      case 'getByEmail':
        await getUserByEmail.refetch();
        if (getUserByEmail.isError) {
          handleCompletion(true);
        } else {
          handleCompletion(false, 'User retrieved successfully');
        }
        break;
      case 'getById':
        await getUserById.refetch();
        if (getUserById.isError) {
          handleCompletion(true);
        } else {
          handleCompletion(false, 'User retrieved successfully');
        }
        break;
      case 'getAll':
        await getAllUsers.refetch();
        if (getAllUsers.isError) {
          handleCompletion(true);
        } else {
          handleCompletion(false, 'Users retrieved successfully');
        }
        break;
    }
  };

  const buttonText = useMemo(() => {
    const loading =
      createUser.isPending ??
      removeUser.isPending ??
      editUser.isPending ??
      getUserByEmail.isLoading ??
      getUserById.isLoading ??
      getAllUsers.isLoading;

    if (loading) return <Loader />;
    return 'Submit';
  }, [
    createUser.isPending,
    removeUser.isPending,
    editUser.isPending,
    getUserByEmail.isLoading,
    getUserById.isLoading,
    getAllUsers.isLoading,
  ]); */

  const getAllUsers = api.userGet.getAllUsers.useQuery(undefined, {
    retry: false
  });
  const [users, setUsers] = useState<UserTableProps[]>([]);

  useEffect(() => {
    if (!getAllUsers.data) return;
    else {
      const usersArray: UserTableProps[] = [];

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
            admin: user.admin,
            developer: user.developer
          });
        }
      });

      if (usersArray.length < 10) {
        for (let i = usersArray.length; i < 10; i++) {
          usersArray.push({
            firstName: '',
            lastName: '',
            country: '',
            city: '',
            postalCode: '',
            address: '',
            email: '',
            admin: false,
            developer: false
          });
        }
      }

      setUsers(usersArray);
    }
  }, [getAllUsers.data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='border-r text-center'>No.</TableHead>
          <TableHead className='border-r'>Email Address</TableHead>
          <TableHead className='border-r'>Full Name</TableHead>
          <TableHead className='border-r'>Full Address</TableHead>
          <TableHead className='border-r'>Role</TableHead>
          <TableHead className='text-center'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, i) => (
          <TableRow key={i}>
            <TableCell className='border-r font-medium text-center text-muted-foreground'>
              {i + 1}.
            </TableCell>
            <TableCell className='border-r truncate'>{user.email}</TableCell>
            <TableCell className='border-r truncate'>
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell className='border-r truncate'>
              {user.email === ''
                ? ''
                : `${user.address}, ${user.postalCode}, ${user.city}, ${user.country}`}
            </TableCell>
            <TableCell className='border-r'>
              {user.email === ''
                ? ''
                : user.developer
                  ? 'Developer'
                  : user.admin
                    ? 'Admin'
                    : 'User'}
            </TableCell>
            <TableCell className='text-center'>
              {user.email !== '' && (
                <>
                  <AdminEditAction user={user} />
                  <AdminDeleteAction email={user.email} />
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
