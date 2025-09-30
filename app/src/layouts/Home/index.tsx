import React from 'react';
import Header from '../../elements/Header';

import './index.css';

interface HomeProps {
    children: React.ReactNode;
}

const Home: React.FC<HomeProps> = ({children}) => {
    return (
        <div className={"homelayout-main"}>
            <Header title="Home Page" />

            <div>{children}</div>
        </div>
    );
};

export default Home;