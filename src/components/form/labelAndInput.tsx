'use client';

import { Input, Label } from '@/components';
import type { AdminUserActionProps } from '@/types';
import { cn } from '@/utils';
import { useState, type FocusEventHandler, type ReactNode } from 'react';

const states = () => ({ hovered: false, focused: false, locked: false });

export function LabelAndInput({
  onBlur,
  id,
  autoComplete,
  children,
  type
}: {
  onBlur: FocusEventHandler<HTMLInputElement>;
  id: string;
  children: ReactNode;
  autoComplete?: string;
  type?: string;
}) {
  const [state, setState] = useState(states);

  return (
    <div className={cn('relative mt-4 w-full p-1')}>
      <Label
        className={cn(
          'absolute left-6 top-1/2 z-0 -mt-[0.1rem] -translate-y-1/2 rounded-lg bg-background px-2 py-0.5 text-muted-foreground transition-all',
          (state.focused || state.hovered || state.locked) && 'text-foreground',
          state.focused && 'outline outline-2 outline-offset-2 outline-primary',
          state.locked && 'top-1 z-[4] mt-0 border text-xs',
          state.hovered && 'border-foreground'
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
          'relative z-[1] bg-transparent',
          state.hovered && 'border-foreground'
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
  onBlur
}: {
  K: keyof AdminUserActionProps;
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'getSingle';

  if (validAction) {
    return (
      <LabelAndInput id='id' onBlur={onBlur}>
        ID <span className='text-destructive'>*</span>
      </LabelAndInput>
    );
  }

  return null;
}

export function FirstName({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='firstName' autoComplete='given-name' onBlur={onBlur}>
        First Name
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function LastName({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='lastName' autoComplete='family-name' onBlur={onBlur}>
        Last Name
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function Country({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='country' autoComplete='country-name' onBlur={onBlur}>
        Country
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function City({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='city' autoComplete='address-level2' onBlur={onBlur}>
        City
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function Address({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='address' autoComplete='street-address' onBlur={onBlur}>
        Address
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function PostalCode({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction = actionType === 'create' || actionType === 'edit';

  if (validAction) {
    return (
      <LabelAndInput id='postalCode' autoComplete='postal-code' onBlur={onBlur}>
        Postal Code
        {actionType === 'create' && (
          <span className='text-destructive'> *</span>
        )}
      </LabelAndInput>
    );
  }

  return null;
}

export function Email({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction =
    actionType === 'create' ||
    actionType === 'edit' ||
    actionType === 'remove' ||
    actionType === 'getSingle';

  if (validAction) {
    return (
      <LabelAndInput
        id='email'
        autoComplete='email'
        type='email'
        onBlur={onBlur}
      >
        Email
        {actionType !== 'edit' && <span className='text-destructive'> *</span>}
      </LabelAndInput>
    );
  }

  return null;
}

export function NewEmail({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
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
  onBlur
}: {
  actionType: AdminUserActionProps;
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
        Password <span className='text-destructive'>*</span>
      </LabelAndInput>
    );
  }

  return null;
}

export function NewPassword({
  actionType,
  onBlur
}: {
  actionType: AdminUserActionProps;
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  if (actionType === 'edit') {
    return (
      <LabelAndInput
        id='newPassword'
        autoComplete='new-password'
        type='password'
        onBlur={onBlur}
      >
        New Password
      </LabelAndInput>
    );
  }

  return null;
}

export function ConfirmPassword({
  actionType,
  caller,
  onBlur
}: {
  actionType: AdminUserActionProps;
  caller?: 'user' | 'admin';
  onBlur: FocusEventHandler<HTMLInputElement>;
}) {
  const validAction =
    (actionType === 'create' || actionType === 'edit') ??
    (caller === 'user' && actionType === 'remove');

  if (validAction) {
    return (
      <LabelAndInput id='confirmPassword' type='password' onBlur={onBlur}>
        Confirm Password <span className='text-destructive'>*</span>
      </LabelAndInput>
    );
  }

  return null;
}
