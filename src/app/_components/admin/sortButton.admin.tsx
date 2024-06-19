import { ChevronRight } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import type { AdminUserSortProps } from '../../_types/_index';
import { Button } from '../_index';

export function AdminSortButton({
  sortKey,
  label,
  userSortOrder,
  onClick
}: {
  sortKey: keyof AdminUserSortProps;
  label: string;
  userSortOrder: AdminUserSortProps;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      className='top-1/2 right-2 absolute -translate-y-1/2'
      variant='ghost'
      size='icon'
      aria-label={`${userSortOrder[sortKey] === 'a-z' ? 'Sorted by A - Z ' + `(${label})` : userSortOrder[sortKey] === 'z-a' ? 'Sorted by Z - A ' + `(${label})` : 'Unsorted'}`}
      title={`${userSortOrder[sortKey] === 'a-z' ? 'A - Z ' + `(${label})` : userSortOrder[sortKey] === 'z-a' ? 'Z - A ' + `(${label})` : 'Unsorted'}`}
      onClick={onClick}
    >
      <ChevronRight
        className={`size-full transition-transform ${userSortOrder[sortKey] === 'a-z' ? 'rotate-90' : userSortOrder[sortKey] === 'z-a' ? 'rotate-[270deg]' : ''}`}
      />
    </Button>
  );
}
