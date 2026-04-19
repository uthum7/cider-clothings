import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState(null);

    const showConfirm = (title, message) => {
        return new Promise((resolve) => {
            setModalConfig({
                title,
                message,
                resolve
            });
        });
    };

    const handleConfirm = () => {
        if (modalConfig) {
            modalConfig.resolve(true);
            setModalConfig(null);
        }
    };

    const handleCancel = () => {
        if (modalConfig) {
            modalConfig.resolve(false);
            setModalConfig(null);
        }
    };

    return (
        <ModalContext.Provider value={{ showConfirm }}>
            {children}
            {modalConfig && (
                <ConfirmModal
                    title={modalConfig.title}
                    message={modalConfig.message}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ModalContext.Provider>
    );
};
