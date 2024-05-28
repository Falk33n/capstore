'use client';

import {
  BarChartHorizontalBig,
  FileSliders,
  ShieldEllipsis,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../_index';

export function AdminSearchbar() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  // Render a searchbar for the admin panel
  return (
    <Command
      className='rounded-lg border shadow-xs mt-3.5 mb-6 hover:shadow-lg transition-shadow'
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setShowSuggestions(false)}
    >
      <CommandInput placeholder='Search...' />
      <CommandList>
        {showSuggestions && (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem
                className='cursor-pointer'
                onMouseDown={() => router.push('/admin/commands')}
              >
                <ShieldEllipsis className='mr-2 h-4 w-4' />
                <span>Admin Commands</span>
              </CommandItem>
              <CommandItem
                className='cursor-pointer'
                onMouseDown={() => router.push('/admin/statistics')}
              >
                <BarChartHorizontalBig className='mr-2 h-4 w-4' />
                <span>Statistics</span>
              </CommandItem>
              <CommandItem
                className='cursor-pointer'
                onMouseDown={() => router.push('/admin/logs')}
              >
                <FileSliders className='mr-2 h-4 w-4' />
                <span>Logs</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}