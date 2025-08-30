"use client";
import React, { createContext, useContext, useState } from "react";
import Alert from "../components/Alert";
import { CircleAlert, X } from "lucide-react";

type OverlayContextType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  isAlertOpen: boolean;
  alertMessage: string | null;
  showAlert: (message: string) => void;
  closeAlert: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Alert state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Alert controls
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
    // Auto close after 3s
    setTimeout(() => setIsAlertOpen(false), 3000);
  };
  const closeAlert = () => setIsAlertOpen(false);

  return (
    <OverlayContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        isAlertOpen,
        alertMessage,
        showAlert,
        closeAlert,
      }}
    >
      {/* UI Overlays */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Custom Modal</h2>
            <p>This is the modal content.</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isAlertOpen && (
        <div className={` p-3 flex gap-3 bg-red-100 text-red-400 rounded`}>
          <CircleAlert className={` text-[1.5rem]`} />
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2 className={`capitalize text-[1.2rem] font-[500]`}>Error</h2>
              <p className={`capitalize text-[1rem]`}>{alertMessage}</p>
            </div>
            <button className="p-2" onClick={closeAlert}>
              <X className={`text-red-400`} />
            </button>
          </div>
        </div>
      )}

      {/* Main App Content */}
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return context;
};
