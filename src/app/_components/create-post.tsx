'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from './_index';

export function CreateUser() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  const register = api.userCreate.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setCountry('');
      setCity('');
      setPostalCode('');
      setAddress('');
    },
  });

  const login = api.auth.loginUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setEmail('');
      setPassword('');
    },
  });

  const makeAdmin = api.userEdit.makeAdmin.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const makeSuperAdmin = api.userEdit.makeSuperAdmin.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const { data, isLoading } = api.auth.checkSession.useQuery(undefined, {
    retry: false,
  });

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
            confirmPassword: confirmPassword,
            country: country,
            city: city,
            postalCode: postalCode,
            address: address,
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
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='lName'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='country'
          value={country}
          onChange={e => setCountry(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='city'
          value={city}
          onChange={e => setCity(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='address'
          value={address}
          onChange={e => setAddress(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='postalCode'
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='psw'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='confirm psw'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <button
          type='submit'
          className='bg-white/10 hover:bg-white/20 px-10 py-3 rounded-full font-semibold transition'
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
        {data && !isLoading ? <p>Login successful</p> : <p>Login failed</p>}
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <input
          type='text'
          placeholder='psw'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='px-4 py-2 rounded-full w-full text-black'
        />
        <button
          type='submit'
          className='bg-white/10 hover:bg-white/20 px-10 py-3 rounded-full font-semibold transition'
          disabled={login.isPending}
        >
          {login.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <form
        onSubmit={e => {
          e.preventDefault();
          makeAdmin.mutate({
            id: '',
            key: '',
          });
        }}
        className='flex flex-col gap-2'
      >
        <h1>Make admin</h1>
        <button
          type='submit'
          className='bg-white/10 hover:bg-white/20 px-10 py-3 rounded-full font-semibold transition'
          disabled={makeAdmin.isPending}
        >
          {makeAdmin.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <form
        onSubmit={e => {
          e.preventDefault();
          makeSuperAdmin.mutate({
            id: '',
            adminKey: '',
            superAdminKey: '',
          });
        }}
        className='flex flex-col gap-2'
      >
        <h1>Make superadmin</h1>
        <button
          type='submit'
          className='bg-white/10 hover:bg-white/20 px-10 py-3 rounded-full font-semibold transition'
          disabled={makeAdmin.isPending}
        >
          {makeAdmin.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}
