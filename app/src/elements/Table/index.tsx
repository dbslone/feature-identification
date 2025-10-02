import React from 'react';

// Styles
import './index.css';

interface TableProps {
    children?: React.ReactNode;
    className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
    return (
        <table className={className}>
            {children}
        </table>
    )
}

export default Table;