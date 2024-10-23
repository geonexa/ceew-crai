import React from 'react'
import { AlertProvider } from './AlertContext'
import AlertMessage from '@/components/AlertMessage'




export default function wrapContexts(props) {
    return (
        <>
            <AlertProvider>
                <AlertMessage />
                {props.children}
            </AlertProvider>

        </>
    )
}
