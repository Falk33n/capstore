import type {
  AdminEditProps,
  AdminSortUserArrayProps,
  AdminSortUserCategoryProps
} from '@/types';
import type { Dispatch, SetStateAction } from 'react';

export function sortUsers<K extends keyof AdminSortUserCategoryProps>(
  key: K,
  userSortOrder: AdminSortUserCategoryProps,
  setUserSortOrder: Dispatch<SetStateAction<AdminSortUserCategoryProps>>,
  users: AdminSortUserArrayProps,
  setUsers: Dispatch<SetStateAction<AdminSortUserArrayProps>>
) {
  const getValue = {
    email: (user: AdminEditProps) => user.email,
    fullName: (user: AdminEditProps) => user.lastName,
    fullAddress: (user: AdminEditProps) => user.country,
    role: (user: AdminEditProps) => (user.email === '' ? '' : user.role)
  }[key];

  const resetSortOrder = (
    currentKey: K,
    newOrder: 'a-z' | 'z-a' | 'unsorted'
  ) => {
    const newSortOrder = {} as AdminSortUserCategoryProps;

    (
      Object.keys(userSortOrder) as Array<keyof AdminSortUserCategoryProps>
    ).forEach(k => {
      newSortOrder[k] = k === currentKey ? newOrder : 'unsorted';
    });

    return newSortOrder;
  };

  const sort = (a: AdminEditProps, b: AdminEditProps, order: 'a-z' | 'z-a') => {
    if (getValue(a) === '') return 1;
    if (getValue(b) === '') return -1;

    if (order === 'a-z') {
      return getValue(a).localeCompare(getValue(b));
    }

    return getValue(b).localeCompare(getValue(a));
  };

  switch (userSortOrder[key]) {
    case 'unsorted':
      setUserSortOrder(resetSortOrder(key, 'a-z'));
      setUsers(prev => ({
        ...prev,
        sorted: [...users.original].sort((a, b) => sort(a, b, 'a-z'))
      }));

      break;
    case 'a-z':
      setUserSortOrder(resetSortOrder(key, 'z-a'));
      setUsers(prev => ({
        ...prev,
        sorted: [...users.original].sort((a, b) => sort(a, b, 'z-a'))
      }));

      break;
    default:
      setUserSortOrder(resetSortOrder(key, 'unsorted'));
      setUsers(prev => ({ ...prev, sorted: [...users.original] }));
      break;
  }
}
