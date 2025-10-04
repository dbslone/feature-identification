import React, { useState } from 'react';

// Elements
import Table from '../Table';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import TableHead from "../TableHead";
import TableBody from "../TableBody";
import Circle from "../Circle";
import Drawer from "../Drawer";

// Icons
import { IconEye, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// Styles
import './index.css';

interface PocketListProps {
    pockets: any[];
}

const PocketList: React.FC<PocketListProps> = ({ pockets }) => {
    const [detailsIndex, setDetailsIndex] = useState<number>(-1);

    const onToggleDetails = (idx) => () => {
        setDetailsIndex(detailsIndex === idx ? -1 : idx);
    }

    const scoreToConfidence = (score: number) => {
        if (score >= 5) {
            return 'High'
        } else if (score < 5 && score >= 3) {
            return 'Medium'
        } else {
            return 'Low';
        }
    }

    console.log({pockets});
    return (
        <div className={"pocket-list-main"}>
            <Table className={"pocket-list-table"}>
                <TableHead>
                    <TableRow style={{ paddingLeft: '5px' }}>
                        <th align="left" style={{ fontWeight: 600 }}>Entity</th>
                        <th align="right" style={{ fontWeight: 600 }}>Confidence</th>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pockets.map((p, idx) => {
                        return (
                            <>
                                <TableRow className="pocket-list-row">
                                    <TableCell>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <Circle color={p.rgb} radius={5}/>
                                            <div style={{paddingLeft: '5px'}}>Product_1_{p.entityId}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div>{scoreToConfidence(p.score)}</div>
                                            <div style={{ cursor: 'pointer' }}>
                                                {/*<IconEye size={22} color="gray" role="button" title="View Pocket" aria-label="View Pocket" onClick={onViewPocket} />*/}
                                                {idx === detailsIndex
                                                    ? <IconChevronUp size={22} color="black" title="Hide Details" aria-label="Hide Details" onClick={onToggleDetails(idx)} />
                                                    : <IconChevronDown size={22} color="gray" title="Show Details" aria-label="Show Details" onClick={onToggleDetails(idx)} />
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {idx === detailsIndex && <Drawer reasons={p.reasons} />}
                            </>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default PocketList;