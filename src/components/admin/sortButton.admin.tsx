import { Button } from '@/components';
import type { AdminSortUserCategoryProps } from '@/types';
import { ChevronRight } from 'lucide-react';
import type { MouseEventHandler } from 'react';

export function AdminSortButton({
  sortKey,
  label,
  userSortOrder,
  onClick
}: {
  sortKey: keyof AdminSortUserCategoryProps;
  label: string;
  userSortOrder: AdminSortUserCategoryProps;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      className='absolute right-2 top-1/2 -translate-y-1/2'
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
