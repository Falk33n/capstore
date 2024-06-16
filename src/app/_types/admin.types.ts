export type UsersCommandProps = 'create' | 'remove' | 'getByEmail' | 'getById' | 'getAll' | 'edit';

export type UserTableProps = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  email: string;
  admin: boolean;
  developer: boolean;
};