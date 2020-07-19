import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';

import Dashboard from './components/dashboard/Dashboard'
import Diagram from './components/diagram/Diagram'
import Sidebar from './components/sidebar/Sidebar';
import TopBar from './components/topbar/TopBar';


const socket = io('http://localhost:3001');
socket.on('connected', (msg: object) => console.log('connected', msg));


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        overflowY: 'hidden',
    }
}));

interface AppState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}

export default function App() {
    const classes = useStyles();

    const getUrlWorkspace = () => {
        const match = /\/workspace\/(\w+)/.exec(window.location.pathname)
        return match ? match[1] : ''
    }

    const [workspace, setWorkspace] = useState(getUrlWorkspace());
    const [state, setState] = useState({
        nodeDataArray: [],
        linkDataArray: [],
        modelData: {
            canRelink: true
        },
        selectedData: null,
        skipsDiagramUpdate: false
    })

    // Load the diagram data for the workspace when it changes.
    useEffect(() => {
        console.log('loading')
        socket.emit('load', {name: workspace});
        socket.on('loaded', (workspace: any) => {
            console.debug(`Loaded ${workspace.name}:`, workspace);
            const state = {
                nodeDataArray: workspace.content ? workspace.content.nodes : [],
                linkDataArray: workspace.content ? workspace.content.links : [],
                modelData: {canRelink: true},
                selectedData: null,
                skipsDiagramUpdate: false
            }
            setState(state);
        });
    }, [workspace]);

    const handleModelChange = (e: go.IncrementalData) => {
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TopBar />
            {
                workspace
                    ? <div className={classes.main}>
                        <Sidebar workspace={workspace} />
                        <Diagram
                            nodeDataArray={state.nodeDataArray}
                            linkDataArray={state.linkDataArray}
                            modelData={state.modelData}
                            skipsDiagramUpdate={state.skipsDiagramUpdate}
                            onModelChange={handleModelChange}
                        />
                    </div>
                    : <div className={classes.main}>
                        <Dashboard onSelectWorkspace={setWorkspace} />
                    </div>
            }
        </div>
    );
}
