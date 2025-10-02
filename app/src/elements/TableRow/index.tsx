import React from 'react';

interface TableRowProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, className, style }) => {
    return (
        <tr className={className} style={style}>
            {children}
        </tr>
    )
}

export default TableRow;