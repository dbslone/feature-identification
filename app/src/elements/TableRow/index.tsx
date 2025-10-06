import React from 'react';

interface TableRowProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClick?: any;
}

const TableRow: React.FC<TableRowProps> = ({ children, className, style, onClick }) => {
    return (
        <tr className={className} style={style} onClick={onClick}>
            {children}
        </tr>
    )
}

export default TableRow;