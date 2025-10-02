import React from 'react';

// Elements
import Table from '../Table';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import TableHead from "../TableHead";
import TableBody from "../TableBody";
import Circle from "../Circle";

// Styles
import './index.css';

interface PocketListProps {
    pockets: any[];
}

const PocketList: React.FC<PocketListProps> = ({ pockets }) => {
    console.log({pockets});
    return (
        <div className={"pocket-list-main"}>
            <Table className={"pocket-list-table"}>
                <TableHead>
                    <TableRow>
                        <th align="left" style={{ fontWeight: 600 }}>Entity</th>
                        <th align="right" style={{ fontWeight: 600 }}>Probability</th>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pockets.map((p) => {
                        return (
                            <TableRow className="pocket-list-row">
                                <TableCell>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Circle color={p.rgb} radius={5}/>
                                        <div style={{paddingLeft: '5px'}}>Product_1_{p.entityId}</div>
                                    </div>
                                    {/* Add drawer to show reasons */}
                                </TableCell>
                                <TableCell>100</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default PocketList;