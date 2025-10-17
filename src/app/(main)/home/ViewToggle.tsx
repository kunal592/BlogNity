'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

export default function ViewToggle() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex gap-1">
      <Button
        variant={view === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setView('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-5 w-5" />
      </Button>
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setView('list')}
        aria-label="List view"
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  );
}
