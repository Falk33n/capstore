'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { UsersCommandProps } from '../../_types/_index';
import {
  Address,
  Button,
  City,
  ConfirmPassword,
  Country,
  Email,
  FirstName,
  Id,
  LastName,
  Loader,
  NewEmail,
  NewPassword,
  Password,
  PostalCode,
  api,
  useToast,
} from '../_index';

const userDetails = () => ({
  id: '',
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  postalCode: '',
  address: '',
  email: '',
  newEmail: '',
  password: '',
  confirmPassword: '',
  newPassword: '',
});

export function AdminUserCommand({
  actionType,
}: {
  actionType: UsersCommandProps;
}) {
  const [user, setUser] = useState(userDetails());
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
  const getAllUsers = api.userGet.getAllUsers.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

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
  ]);

  return (
    <form
      className='flex flex-col justify-center items-center gap-2 px-12 py-1 pb-3'
      onSubmit={async e => {
        e.preventDefault();
        await handleSubmit();
      }}
    >
      <Id
        actionType={actionType}
        onBlur={e => setUser({ ...user, id: e.target.value })}
      />
      <FirstName
        actionType={actionType}
        onBlur={e => setUser({ ...user, firstName: e.target.value })}
      />
      <LastName
        actionType={actionType}
        onBlur={e => setUser({ ...user, lastName: e.target.value })}
      />
      <Country
        actionType={actionType}
        onBlur={e => setUser({ ...user, country: e.target.value })}
      />
      <City
        actionType={actionType}
        onBlur={e => setUser({ ...user, city: e.target.value })}
      />
      <Address
        actionType={actionType}
        onBlur={e => setUser({ ...user, address: e.target.value })}
      />
      <PostalCode
        actionType={actionType}
        onBlur={e => setUser({ ...user, postalCode: e.target.value })}
      />
      <Email
        actionType={actionType}
        onBlur={e => setUser({ ...user, email: e.target.value })}
      />
      <NewEmail
        actionType={actionType}
        onBlur={e => setUser({ ...user, newEmail: e.target.value })}
      />
      <Password
        actionType={actionType}
        onBlur={e => setUser({ ...user, password: e.target.value })}
      />
      <NewPassword
        actionType={actionType}
        onBlur={e => setUser({ ...user, newPassword: e.target.value })}
      />
      <ConfirmPassword
        actionType={actionType}
        onBlur={e => setUser({ ...user, confirmPassword: e.target.value })}
      />
      <div className='flex justify-center items-center px-1 py-5 w-full'>
        <Button
          variant={actionType === 'remove' ? 'destructive' : 'default'}
          className='w-full'
          type='submit'
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
