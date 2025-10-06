import React, { useState } from 'react';

// Icons
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// Styles
import './index.css';

interface DrawerProps {
    reasons?: string[];
    adjacentEdges?: any[];
}
const Drawer: React.FC<DrawerProps> = ({ reasons, adjacentEdges }) => {
    const [showAdjacentEdges, setShowAdjacentEdges] = useState<boolean>(false);
    console.log({showAdjacentEdges});
    const onToggle = (e) => {
        e.stopPropagation();
        console.log({adjacentEdges, showAdjacentEdges})
        setShowAdjacentEdges(!showAdjacentEdges);
    }

    return (
        <div>
            <ul>
                {reasons?.map((reason, idx) => {
                    return (
                        <li key={idx}>{reason}</li>
                    )
                })}
            </ul>
            {adjacentEdges.length > 0 && (<div className="drawer-adjacent-toggle" onClick={onToggle}>
                <div>Show Adjacent Edges</div>
                <div>
                    {showAdjacentEdges
                        ? <IconChevronUp size={22} color="black" title="Hide Details" aria-label="Hide Details"/>
                        : <IconChevronDown size={22} color="gray" title="Show Details" aria-label="Show Details"/>
                    }
                </div>
            </div>)}
            {showAdjacentEdges && (
                <ul className="drawer-adjacent-edges">
                    {adjacentEdges.map((edge, idx) => {
                        return (
                            <li key={idx}>Product_1_{edge.entityId}</li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default Drawer;