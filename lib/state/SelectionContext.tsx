'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SelectionContextType = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const SelectionContext = createContext<SelectionContextType>({
  selectedId: null,
  setSelectedId: () => {},
});

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <SelectionContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext);
}
