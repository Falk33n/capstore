import type { FocusEventHandler, ReactNode } from 'react';
import type { UsersCommandProps } from '../../_types/_index';
import { Input, Label } from '../_index';

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
      <Label className='top-0 left-0 absolute' htmlFor={id}>
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
