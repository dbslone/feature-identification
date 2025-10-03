import React from 'react';

interface DrawerProps {
    reasons?: string[];
}
const Drawer: React.FC<DrawerProps> = ({ reasons }) => {
    return (
        <div>
            <ul>
                {reasons?.map((reason, idx) => {
                    return (
                        <li key={idx}>{reason}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Drawer;