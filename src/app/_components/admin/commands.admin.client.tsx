'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { UsersCommandProps } from '../../_types/usersCommand.types';
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
  const [user, setUser] = useState(userDetails);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
    setUser(userDetails);
  };

  const createUser = api.userCreate.createUser.useMutation({
    onSuccess: handleSuccess,
  });
  const removeUser = api.userRemove.removeUserAsAdmin.useMutation({
    onSuccess: handleSuccess,
  });
  const editUser = api.userEdit.editUser.useMutation({
    onSuccess: handleSuccess,
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
        if (getUserByEmail.data) {
          handleSuccess;
        }
        break;
      case 'getById':
        await getUserById.refetch();
        if (getUserById.data) {
          handleSuccess;
        }
        break;
      case 'getAll':
        await getAllUsers.refetch();
        if (getAllUsers.data) {
          handleSuccess;
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
      className='flex flex-col justify-center items-center gap-6 mx-auto w-3/4'
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
      <Button className='w-full' type='submit'>
        {buttonText}
      </Button>
    </form>
  );
}
