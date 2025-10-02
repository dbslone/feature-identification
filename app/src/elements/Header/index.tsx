import React from "react";

import './index.css';

interface HeaderProps {
    title?: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
    return <header>{title || children}</header>;
};

export default Header;