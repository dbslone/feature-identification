import React from 'react';

interface TableHeadProps {
    children?: React.ReactNode;
}

const TableHead: React.FC<TableHeadProps> = ({ children }) => {
    return (
        <thead>
            {children}
        </thead>
    )
}

export default TableHead;