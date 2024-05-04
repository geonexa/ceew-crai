import React, { useEffect } from 'react';
import { useAlertContext } from '../context/AlertContext';

const AlertMessage = () => {
    const { alertMessage, showAlert, setShowAlert } = useAlertContext();

    useEffect(() => {
        let timeout;
        if (showAlert) {
            timeout = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [showAlert, setShowAlert]);

    return (
        <>
            {showAlert && (
                <div className={`alert_container ${showAlert ? '' : 'hide-alert'}`}>
                    {alertMessage}
                </div>
            )}


        </>
    )
}

export default AlertMessage;
