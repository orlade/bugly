import React from "react";
import Button from '@material-ui/core/Button';

interface DashboardProps {
    onSelectWorkspace: (workspace: string) => void;
}

export default function Dashboard({onSelectWorkspace}: DashboardProps) {
    const onCreateWorkspaceClick = () => {
        const name = prompt("Enter a workspace name")
        console.log(name)
        if (!name) {
            return
        }
        window.history.pushState(null, name, `/${name}`)
        onSelectWorkspace(name)
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => onCreateWorkspaceClick()}>
                Create workspace
            </Button>
        </div>
    )
}
