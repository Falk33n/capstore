'use client';

import { useRouter } from 'next/navigation';
import { useState, type FocusEventHandler, type ReactNode } from 'react';
import type { UsersCommandProps } from '../../_types/usersCommand.types';
import { Button, Input, Label, Loader, api } from '../_index';

const userDetails = {
  id: '',
  firstName: '',
  lastName: '',
  currentEmail: '',
  newEmail: '',
  currentPassword: '',
  confirmPassword: '',
  newPassword: '',
};

// Component to let the admin make actions on the backend from the Admin Command Page
export function AdminUserCommand({
  actionType,
}: {
  actionType: UsersCommandProps;
}) {
  const [user, setUser] = useState(userDetails);
  const router = useRouter();

  const createUser = api.user.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setUser({ ...userDetails });
    },
  });

  const removeUser = api.user.removeUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setUser({ ...userDetails });
    },
  });

  const editUser = api.user.editUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setUser({ ...userDetails });
    },
  });

  const {
    data: userByEmail,
    isLoading: userByEmailIsLoading,
    refetch: getUserByEmail,
  } = api.user.getUserByEmail.useQuery(
    {
      currentEmail: user.currentEmail,
    },
    { enabled: false, retry: false },
  );

  const {
    data: userById,
    isLoading: userByIdIsLoading,
    refetch: getUserById,
  } = api.user.getUserById.useQuery(
    {
      id: user.id,
    },
    { enabled: false, retry: false },
  );

  const {
    data: allUsers,
    isLoading: allUsersIsLoading,
    refetch: getAllUsers,
  } = api.user.getAllUsers.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  // Different actions is simply changed based on the actionType prop

  const buttonText = () => {
    if (actionType === 'create')
      return createUser.isPending ? <Loader /> : 'Submit';
    else if (actionType === 'remove')
      return removeUser.isPending ? <Loader /> : 'Submit';
    else if (actionType === 'edit')
      return editUser.isPending ? <Loader /> : 'Submit';
    else if (actionType === 'getByEmail')
      return userByEmailIsLoading ? <Loader /> : 'Submit';
    else if (actionType === 'getById')
      return userByIdIsLoading ? <Loader /> : 'Submit';
    else if (actionType === 'getAll')
      return allUsersIsLoading ? <Loader /> : 'Submit';
  };

  const createOrEdit = () => {
    if (actionType === 'create' || actionType === 'edit') return true;
    return false;
  };

  const email = () => {
    if (actionType === 'getByEmail' || actionType === 'remove') return true;
    return false;
  };

  const id = () => {
    if (actionType === 'getById') return true;
    return false;
  };

  return (
    <form
      className='w-3/4 flex flex-col items-center justify-center mx-auto gap-6'
      onSubmit={async e => {
        e.preventDefault();
        if (actionType === 'create')
          createUser.mutate({
            firstName: user.firstName,
            lastName: user.lastName,
            currentEmail: user.currentEmail,
            currentPassword: user.currentPassword,
            confirmPassword: user.confirmPassword,
          });
        else if (actionType === 'remove')
          removeUser.mutate({
            currentEmail: user.currentEmail,
          });
        else if (actionType === 'edit')
          editUser.mutate({
            firstName: user.firstName,
            lastName: user.lastName,
            currentEmail: user.currentEmail,
            newEmail: user.newEmail,
            currentPassword: user.currentPassword,
            newPassword: user.newPassword,
            confirmPassword: user.confirmPassword,
          });
        else if (actionType === 'getByEmail') {
          await getUserByEmail();
          if (userByEmail) setUser({ ...userDetails });
        } else if (actionType === 'getById') {
          await getUserById();
          if (userById) setUser({ ...userDetails });
        } else if (actionType === 'getAll') {
          await getAllUsers();
          if (allUsers) setUser({ ...userDetails });
        }
      }}
    >
      {id() && (
        <LabelAndInput
          id='userId'
          onBlur={e => setUser({ ...user, id: e.target.value })}
        >
          User ID
        </LabelAndInput>
      )}
      {createOrEdit() && (
        <>
          <LabelAndInput
            id='firstName'
            autoComplete='given-name'
            onBlur={e => setUser({ ...user, firstName: e.target.value })}
          >
            First Name
          </LabelAndInput>
          <LabelAndInput
            id='lastName'
            autoComplete='family-name'
            onBlur={e => setUser({ ...user, lastName: e.target.value })}
          >
            Last Name
          </LabelAndInput>
        </>
      )}
      {(createOrEdit() || email()) && (
        <LabelAndInput
          id='currentEmail'
          autoComplete='email'
          type='email'
          onBlur={e => setUser({ ...user, currentEmail: e.target.value })}
        >
          Email
        </LabelAndInput>
      )}
      {actionType === 'edit' && (
        <LabelAndInput
          id='email'
          autoComplete={actionType === 'edit' ? 'off' : 'email'}
          type='email'
          onBlur={e => setUser({ ...user, newEmail: e.target.value })}
        >
          New Email
        </LabelAndInput>
      )}
      {createOrEdit() && (
        <>
          <LabelAndInput
            id='password'
            autoComplete='new-password'
            type='password'
            onBlur={e => setUser({ ...user, currentPassword: e.target.value })}
          >
            Password
          </LabelAndInput>
          {actionType === 'edit' && (
            <LabelAndInput
              id='new-Password'
              type='password'
              onBlur={e => setUser({ ...user, newPassword: e.target.value })}
            >
              New Password
            </LabelAndInput>
          )}
          <LabelAndInput
            id='confirmPassword'
            type='password'
            onBlur={e => setUser({ ...user, confirmPassword: e.target.value })}
          >
            Confirm Password
          </LabelAndInput>
        </>
      )}
      <Button className='w-full' type='submit'>
        {buttonText()}
      </Button>
    </form>
  );
}

export function LabelAndInput({
  onBlur,
  id,
  autoComplete,
  children,
  type,
}: {
  onBlur: FocusEventHandler<HTMLInputElement>;
  id: string;
  children: ReactNode;
  autoComplete?: string;
  type?: string;
}) {
  return (
    <div className='relative'>
      <Label className='absolute top-0 left-0' htmlFor={id}>
        {children}
      </Label>
      <Input
        id={id}
        name={id}
        type={type ?? 'text'}
        autoComplete={autoComplete ?? 'off'}
        onBlur={onBlur}
      />
    </div>
  );
}
