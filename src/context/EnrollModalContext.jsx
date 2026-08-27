import React, { createContext, useContext, useState } from 'react';

const EnrollModalContext = createContext();

export function EnrollModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [eventMeta, setEventMeta] = useState(null);

  const openEnrollModal = (programTitle = '', extraMeta = null) => {
    if (programTitle) {
      setSelectedProgram(programTitle);
    }
    if (extraMeta) {
      setEventMeta(extraMeta);
    } else {
      setEventMeta(null);
    }
    setIsOpen(true);
  };

  const closeEnrollModal = () => {
    setIsOpen(false);
    setEventMeta(null);
  };

  return (
    <EnrollModalContext.Provider
      value={{
        isOpen,
        selectedProgram,
        eventMeta,
        setSelectedProgram,
        openEnrollModal,
        closeEnrollModal,
      }}
    >
      {children}
    </EnrollModalContext.Provider>
  );
}

export function useEnrollModal() {
  const context = useContext(EnrollModalContext);
  if (!context) {
    throw new Error('useEnrollModal must be used within an EnrollModalProvider');
  }
  return context;
}
