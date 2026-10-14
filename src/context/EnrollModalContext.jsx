import React, { createContext, useContext, useState } from 'react';
import { useCommunityAuth } from '../features/community/context/CommunityAuthContext';

const EnrollModalContext = createContext();

export function EnrollModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [eventMeta, setEventMeta] = useState(null);
  const { user, token, openAuthModal } = useCommunityAuth();

  const openEnrollModal = (programTitle = '', extraMeta = null) => {
    // Restriction: User must be signed up / logged in before registering for events or ongoing activities
    if (!user || !token) {
      const isEvent = Boolean(extraMeta?.sourceType === 'Event' || extraMeta?.eventId);
      const notice = isEvent
        ? 'Please sign up or log in to register for upcoming workshops and academy events.'
        : 'Please sign up or log in to enroll in academy programs and ongoing learning activities.';

      openAuthModal('signup', notice, () => {
        if (programTitle) setSelectedProgram(programTitle);
        if (extraMeta) setEventMeta(extraMeta);
        setIsOpen(true);
      });
      return;
    }

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
