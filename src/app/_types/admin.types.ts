export type UsersCommandProps =
  | 'create'
  | 'remove'
  | 'getByEmail'
  | 'getById'
  | 'getAll'
  | 'edit';

export type SortProps = 'unsorted' | 'a-z' | 'z-a';

export type AdminUserSortProps = 
  {
    email: SortProps;
    fullName: SortProps;
    fullAddress: SortProps;
    role: SortProps;
  }


export type AdminUserSortValueProps = {
  original: AdminUserEditProps[];
  sorted: AdminUserEditProps[];
};

export type AdminUserEditProps = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  email: string;
  admin: string;
  developer: string;
};
