import type { SortProps } from '@/types';

export type AdminUserActionProps =
  | 'create'
  | 'remove'
  | 'getSingle'
  | 'getAll'
  | 'edit';

export type AdminEditProps = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  email: string;
  role: string;
};

export type AdminSortUserCategoryProps = {
  email: SortProps;
  fullName: SortProps;
  fullAddress: SortProps;
  role: SortProps;
};

export type AdminSortUserArrayProps = {
  original: AdminEditProps[];
  sorted: AdminEditProps[];
};
