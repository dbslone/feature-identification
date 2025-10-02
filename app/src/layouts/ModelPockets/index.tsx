import React from 'react';

// Elements
import ModelViewer from '../../elements/ModelViewer';
import PocketList from '../../elements/PocketList';

// Library utilities
import detectPockets from "../../lib/detectPockets";

const ModelPockets = () => {

    const {filteredPockets, graph} = detectPockets();

    return (
        <div>
            <ModelViewer graph={graph} />
            <PocketList pockets={filteredPockets} />
        </div>
    )
};

export default ModelPockets;