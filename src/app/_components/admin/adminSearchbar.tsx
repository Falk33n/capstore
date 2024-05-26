'use client';

import {
  BarChartHorizontalBig,
  FileSliders,
  ShieldEllipsis,
} from 'lucide-react';
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
  const [show, setShow] = useState(false);

  return (
    <Command
      className='rounded-lg border shadow-md mt-3.5 mb-6 hover:shadow-xl transition-shadow'
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        {show && (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <ShieldEllipsis className='mr-2 h-4 w-4' />
                <span>Admin Commands</span>
              </CommandItem>
              <CommandItem>
                <BarChartHorizontalBig className='mr-2 h-4 w-4' />
                <span>Statistics</span>
              </CommandItem>
              <CommandItem>
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
