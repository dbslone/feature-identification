import React from 'react';
import ReactDOM from 'react-dom';

// Elements
import Home from './layouts/Home';
import ModelPockets from "./layouts/ModelPockets";

const App = () => (
    <React.Fragment>
        <Home>
            <ModelPockets />
        </Home>
    </React.Fragment>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
