import React from 'react';

interface TableBodyProps {
    children?: React.ReactNode;
    style?: React.CSSProperties
}

const TableBody: React.FC<TableBodyProps> = ({ children, style }) => {
    return (
        <tbody style={style}>
            {children}
        </tbody>
    )
}

export default TableBody;