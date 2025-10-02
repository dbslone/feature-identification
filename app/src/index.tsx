import React from 'react';
import ReactDOM from 'react-dom';

import ModelViewer from './elements/ModelViewer';
import Home from './layouts/Home';

const App = () => (
    <React.Fragment>
        <Home>
            <ModelViewer />
        </Home>
    </React.Fragment>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
