import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

import './App.css';

import Diagram from './components/diagram/Diagram'


const socket = io('http://localhost:3001');
socket.on('connected', (msg: object) => console.log('connected', msg));

interface AppState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}

export default function App() {
    const [workspace,] = useState('acceleration');
    const [state, setState] = useState({
            nodeDataArray: [],
            linkDataArray: [],
            modelData: {
                canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false
        }
    )

    // Load the diagram data for the workspace when it changes.
    useEffect(() => {
        console.log('loading')
        socket.emit('load', {name: workspace});
        socket.on('loaded', (workspace: any) => {
            console.debug(`Loaded ${workspace.name}:`, workspace);
            setState({
                nodeDataArray: workspace.nodes,
                linkDataArray: workspace.links,
                modelData: {canRelink: true},
                selectedData: null,
                skipsDiagramUpdate: false
            });
        });
    }, [workspace]);

    const handleModelChange = (e: go.IncrementalData) => {
    }

    return (
        <div className="App">
            <h1>Bugly</h1>
            <Diagram
                nodeDataArray={state.nodeDataArray}
                linkDataArray={state.linkDataArray}
                modelData={state.modelData}
                skipsDiagramUpdate={state.skipsDiagramUpdate}
                onModelChange={handleModelChange}
            />
        </div>
    );
}
