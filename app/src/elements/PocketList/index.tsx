import React from 'react';

// Elements
import Table from '../Table';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import TableHead from "../TableHead";
import TableBody from "../TableBody";

interface PocketListProps {
    pockets: any[];
}

const PocketList: React.FC<PocketListProps> = ({ pockets }) => {
    console.log({pockets});
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pocket ID</TableCell>
                        <TableCell>Pocket Area</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>100</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default PocketList;