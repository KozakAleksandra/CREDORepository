import React from 'react'
import { Navigation } from '../Navigation/Navigation';

export const Layout = ({ children }) => {
    return (
        <>
            <Navigation />
            <div>
                {children}
            </div>
        </>
    )
}
