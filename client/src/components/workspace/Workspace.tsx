import React, {useEffect, useState} from 'react';

import {makeStyles} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(0, 1),
    },
}));

interface WorkspaceProps {
    workspace: string
}


interface Project {
    name: string,
    path: string,
    items: Array<Project>
}

//socket, file, onFileSelect
export default function Workspace({workspace}: WorkspaceProps) {
    const classes = useStyles();

    const [projects, setProjects] = useState([
        {
            name: 'test',
            path: 'test',
            items: [
                {
                    name: 'foo',
                    path: 'foo',
                    children: []
                }
            ],
        }
    ]);

    // useEffect(() => {
    //     socket.emit('load', {});
    //     socket.on('loaded', workspace => {
    //         console.debug(`Loaded ${workspace.name}:`, workspace);
    //         setProjects(workspace.projects);
    //     });
    // }, [socket]);

    interface TreeContent {
        name: string,
        path: string,
        children: Array<TreeContent>
    }

    const renderTree = ({name, path, children = []}: TreeContent) => (
        <TreeItem key={name} nodeId={name} label={name} onClick={e => {}/*onFileSelect(path)*/}>
            {children.map(renderTree)}
        </TreeItem>
    );

    const onAddRepoClick = () => {
        const url = prompt("Enter a repo URL")
        console.log(url)
    }

    return (
        <div className={classes.container}>
            {projects.map(({name, path, items}) =>
                <TreeView
                    key={name}
                    defaultExpanded={[name]}
                    defaultCollapseIcon={<FolderOpenIcon />}
                    defaultExpandIcon={<FolderIcon />}
                    defaultEndIcon={<DescriptionIcon />}
                >
                    {renderTree({name, path, children: items})}
                </TreeView>
            )}
            <Button variant="contained" color="primary" onClick={() => onAddRepoClick()}>
                Add Repo
            </Button>
        </div>
    );
}
