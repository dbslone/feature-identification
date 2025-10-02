import React from 'react';

interface TableCellProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    width?: number;
}

const TableCell: React.FC<TableCellProps> = ({ children, style, width }) => {
    return (
        <td width={width} style={style}>
            {children}
        </td>
    )
}

export default TableCell;