import React from 'react';
import './Sidebar.css';

import {makeStyles} from '@material-ui/core/styles';

import Workspace from '../workspace/Workspace';
import MiniDrawer from '../minidrawer/MiniDrawer';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
}));

interface SidebarProps {
    workspace: string
}

export default function Sidebar(props: SidebarProps) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <MiniDrawer content={<Workspace key="workspace" {...props} />} />
            {/* <MiniDrawer content={<FormatList key="formats" {...props} />} /> */}
        </div >
    );
}
