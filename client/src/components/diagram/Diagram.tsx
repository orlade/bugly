import React from "react";
import {ReactDiagram} from "gojs-react";

import './Diagram.css'

import initDiagram from "./Config";

interface DiagramProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    onModelChange: (e: go.IncrementalData) => void;
}

export default function Diagram(props: DiagramProps) {

    const initAndSetDiagram = () => {
        const newDiagram = initDiagram();
        // setDiagram(newDiagram);
        return newDiagram;
    }

    console.log(props.nodeDataArray)

    return (
        <ReactDiagram
            initDiagram={initAndSetDiagram}
            divClassName={'diagram-component'}
            nodeDataArray={props.nodeDataArray}
            linkDataArray={props.linkDataArray}
            modelData={props.modelData}
            skipsDiagramUpdate={props.skipsDiagramUpdate}
            onModelChange={props.onModelChange}
        />
    )
}
