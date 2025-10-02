import React from 'react';

interface CircleProps {
    color?: string;
    radius: number;
    strokeWidth?: number;
    strokeColor?: string;
}

const Circle: React.FC<CircleProps> = ({ color, radius, strokeWidth, strokeColor }) => {
    return (
        <svg width={radius*2} height={radius*2} xmlns="http://www.w3.org/2000/svg">
            <circle
                cx={radius}
                cy={radius}
                r={radius}
                fill={`rgb(${color.split('-').join(', ')})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        </svg>
    )
};

export default Circle;