import React from 'react';

interface DrawerProps {
    children?: React.ReactNode;
}
const Drawer: React.FC<DrawerProps> = ({ children }) => {
    return (
        <div>
            Drawer
        </div>
    )
}