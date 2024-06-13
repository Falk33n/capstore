'use client';

import { useState, type FocusEventHandler, type ReactNode } from 'react';
import type { UsersCommandProps } from '../../_types/_index';
import { Input, Label, cn } from '../_index';

const states = () => ({ hovered: false, focused: false, locked: false });

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
  const [state, setState] = useState(states);

  return (
    <div className={cn('relative p-1 mt-4 w-full')}>
      <Label
        className={cn(
          'top-1/2 left-6 absolute text-muted-foreground -mt-[0.1rem] z-0 -translate-y-1/2 bg-background transition-all px-2 py-0.5 rounded-lg',
          (state.focused || state.hovered || state.locked) && 'text-foreground',
          state.focused && 'outline-primary outline-2 outline outline-offset-2',
          state.locked && 'top-1 text-xs border z-[4] mt-0',
          state.hovered && 'border-foreground',
        )}
        htmlFor={id}
      >
        {children}
      </Label>
      <Input
        id={id}
        name={id}
        type={type ?? 'text'}
        className={cn(
          'bg-transparent relative z-[1]',
          state.hovered && 'border-foreground',
        )}
        autoComplete={autoComplete ?? 'off'}
        onFocus={() => setState({ ...state, focused: true, locked: true })}
        onMouseEnter={() => setState({ ...state, hovered: true })}
        onMouseLeave={() => setState({ ...state, hovered: false })}
        onBlur={e => {
          setState({ ...state, focused: false });
          onBlur(e);
        }}
      />
    </div>
  );
}

export function Id({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'getById';

  if (validAction) {
    return (
      <LabelAndInput id='id' onBlur={onBlur}>
        ID
      </LabelAndInput>
    );
  }

  return null;
}

export function FirstName({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='firstName' autoComplete='given-name' onBlur={onBlur}>
        First Name
      </LabelAndInput>
    );
  }

  return null;
}

export function LastName({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='lastName' autoComplete='family-name' onBlur={onBlur}>
        Last Name
      </LabelAndInput>
    );
  }

  return null;
}

export function Country({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='country' autoComplete='country-name' onBlur={onBlur}>
        Country
      </LabelAndInput>
    );
  }

  return null;
}

export function City({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='city' autoComplete='address-level2' onBlur={onBlur}>
        City
      </LabelAndInput>
    );
  }

  return null;
}

export function Address({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='address' autoComplete='street-address' onBlur={onBlur}>
        Address
      </LabelAndInput>
    );
  }

  return null;
}

export function PostalCode({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='postalCode' autoComplete='postal-code' onBlur={onBlur}>
        Postal Code
      </LabelAndInput>
    );
  }

  return null;
}

export function Email({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction =
    actionType === 'create' ||
    actionType === 'edit' ||
    actionType === 'remove' ||
    actionType === 'getByEmail';

  if (validAction) {
    return (
      <LabelAndInput
        id='email'
        autoComplete='email'
        type='email'
        onBlur={onBlur}
      >
        Email
      </LabelAndInput>
    );
  }

  return null;
}

export function NewEmail({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  if (actionType === 'edit') {
    return (
      <LabelAndInput id='newEmail' type='email' onBlur={onBlur}>
        New Email
      </LabelAndInput>
    );
  }

  return null;
}

export function Password({
  actionType,
  caller,
  onBlur,
}: {
  actionType: UsersCommandProps;
  caller?: 'user' | 'admin';
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction =
    (actionType === 'create' || actionType === 'edit') ??
    (caller === 'user' && actionType === 'remove');

  if (validAction) {
    return (
      <LabelAndInput
        id='password'
        autoComplete='new-password'
        type='password'
        onBlur={onBlur}
      >
        Password
      </LabelAndInput>
    );
  }

  return null;
}

export function NewPassword({
  actionType,
  onBlur,
}: {
  actionType: UsersCommandProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  if (actionType === 'edit') {
    return (
      <LabelAndInput id='new-Password' type='password' onBlur={onBlur}>
        New Password
      </LabelAndInput>
    );
  }

  return null;
}

export function ConfirmPassword({
  actionType,
  caller,
  onBlur,
}: {
  actionType: UsersCommandProps;
  caller?: 'user' | 'admin';
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction =
    (actionType === 'create' || actionType === 'edit') ??
    (caller === 'user' && actionType === 'remove');

  if (validAction) {
    return (
      <LabelAndInput id='confirmPassword' type='password' onBlur={onBlur}>
        Confirm Password
      </LabelAndInput>
    );
  }

  return null;
}
