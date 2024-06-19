import type { Dispatch, SetStateAction } from 'react';
import type {
  AdminUserEditProps,
  AdminUserSortProps,
  AdminUserSortValueProps
} from '../_types/_index';

export function sortUsers<K extends keyof AdminUserSortProps>(
  key: K,
  userSortOrder: AdminUserSortProps,
  setUserSortOrder: Dispatch<SetStateAction<AdminUserSortProps>>,
  users: AdminUserSortValueProps,
  setUsers: Dispatch<SetStateAction<AdminUserSortValueProps>>
) {
  const getValue = {
    email: (user: AdminUserEditProps) => user.email,
    fullName: (user: AdminUserEditProps) => user.lastName,
    fullAddress: (user: AdminUserEditProps) => user.country,
    role: (user: AdminUserEditProps) =>
      user.email === ''
        ? ''
        : user.developer === 'True'
          ? 'Developer'
          : user.admin === 'True'
            ? 'Admin'
            : 'User'
  }[key];

  const resetSortOrder = (
    currentKey: K,
    newOrder: 'a-z' | 'z-a' | 'unsorted'
  ) => {
    const newSortOrder = {} as AdminUserSortProps;

    (Object.keys(userSortOrder) as Array<keyof AdminUserSortProps>).forEach(
      k => {
        newSortOrder[k] = k === currentKey ? newOrder : 'unsorted';
      }
    );

    return newSortOrder;
  };

  switch (userSortOrder[key]) {
    case 'unsorted':
      setUserSortOrder(resetSortOrder(key, 'a-z'));
      setUsers(prev => ({
        ...prev,
        sorted: [...users.original].sort((a, b) => {
          if (getValue(a) === '') return 1;
          if (getValue(b) === '') return -1;
          return getValue(a).localeCompare(getValue(b));
        })
      }));

      break;
    case 'a-z':
      setUserSortOrder(resetSortOrder(key, 'z-a'));
      setUsers(prev => ({
        ...prev,
        sorted: [...users.original].sort((a, b) => {
          if (getValue(a) === '') return 1;
          if (getValue(b) === '') return -1;
          return getValue(b).localeCompare(getValue(a));
        })
      }));

      break;
    default:
      setUserSortOrder(resetSortOrder(key, 'unsorted'));
      setUsers(prev => ({ ...prev, sorted: [...users.original] }));
      break;
  }
}
