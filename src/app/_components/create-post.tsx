'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '~/trpc/react';

export function CreateUser() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = api.user.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    },
  });

  const login = api.user.loginUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setEmail('');
      setPassword('');
    },
  });

  const { data, isLoading } = api.user.checkSession.useQuery();

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          register.mutate({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          });
        }}
        className='flex flex-col gap-2'
      >
        <h1>Create User</h1>
        <input
          type='text'
          placeholder='fName'
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <input
          type='text'
          placeholder='lName'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <input
          type='text'
          placeholder='psw'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <button
          type='submit'
          className='rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20'
          disabled={login.isPending}
        >
          {register.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <form
        onSubmit={e => {
          e.preventDefault();
          login.mutate({
            email: email,
            password: password,
          });
        }}
        className='flex flex-col gap-2'
      >
        <h1>Login User</h1>
        {data?.isValid && !isLoading ? (
          <p>Login successful</p>
        ) : (
          <p>Login failed</p>
        )}
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <input
          type='text'
          placeholder='psw'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full rounded-full px-4 py-2 text-black'
        />
        <button
          type='submit'
          className='rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20'
          disabled={login.isPending}
        >
          {login.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}
