// import propertyTemplate from './PropertyTemplate'
// import methodTemplate from './MethodTemplate'

import * as go from 'gojs';
import {GraphLinksModel, ObjectData} from 'gojs';

const $ = go.GraphObject.make;

const addNodeAndLink = (e: go.InputEvent, obj: go.ObjectData) => {
    var fromNode = obj.part;
    var diagram = fromNode.diagram;
    diagram.startTransaction("Add State");
    // get the node data for which the user clicked the button
    var fromData = fromNode.data;

    const toId = getNextId(diagram);
    var toData = {
        id: toId,
        key: toId,
        name: `New (${toId})`,
        properties: [],
    };
    // add the new node data to the model
    var model = diagram.model;
    model.addNodeData(toData);
    // create a link data from the old node data to the new node data
    const linkId = `${parseInt(toId) + 1}`;
    var linkdata = {
        id: linkId,
        key: linkId,
        from: model.getKeyForNodeData(fromData),
        to: model.getKeyForNodeData(toData),
        label: "link",
        properties: [],
    };
    // and add the link data to the model
    model.addLinkData(linkdata);
    var newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);
    // snap the new node to a valid location
    var p = fromNode.location.copy();
    newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
    // then account for any overlap
    // shiftNodesToEmptySpaces();
    diagram.commitTransaction("Add State");
}

const handleMouseLeave = (e: go.InputEvent, obj: go.ObjectData) => {
    obj.part.adornedPart.removeAdornment("mouseHover")
}

const nodeHoverAdornment =
    $(go.Adornment, "Spot",
        {
            background: "transparent",
            mouseLeave: handleMouseLeave,
        },
        $(go.Placeholder, {background: "transparent"}),
        $("Button",
            {
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Left,
                click: addNodeAndLink,
            },
            $(go.TextBlock, "+")
        ));

interface TreeDiagram extends go.Diagram {
    model: GraphLinksModel
}

const getNextId = (diagram: TreeDiagram) => {
    function getMaxId(items: Array<ObjectData>) {
        const ids = items.map((n: ObjectData) => parseInt(n.id) || -1).sort((a, b) => a - b);
        return ids[ids.length - 1];
    }

    const nodeData = diagram.model.nodeDataArray;
    const linkData = diagram.model.linkDataArray;
    return `${Math.max(getMaxId(nodeData), getMaxId(linkData)) + 1}`;
}

export default $(go.Node, "Auto",
    {
        locationSpot: go.Spot.Center,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
    },
    $(go.Shape, {fill: "lightyellow"}),
    $(go.Panel, "Table",
        {defaultRowSeparatorStroke: "black"},
        $(go.TextBlock,
            {
                row: 0,
                columnSpan: 2,
                margin: 3,
                alignment: go.Spot.Center,
                font: "bold 12pt sans-serif",
                isMultiline: false,
                editable: true
            },
            new go.Binding("text", "name").makeTwoWay()),
        $(go.Panel, "Vertical",
            new go.Binding("itemArray", "properties"),
            {
                row: 1,
                margin: 3,
                // itemTemplate: propertyTemplate
            }
        ),
        $(go.Panel, "Vertical",
            new go.Binding("itemArray", "methods"),
            {
                row: 2,
                margin: 3,
                // itemTemplate: methodTemplate,
            }
        ),
    ),
    {
        mouseHover: function (e: go.InputEvent, obj: go.ObjectData) {
            var node = obj.part;
            nodeHoverAdornment.adornedObject = node;
            node.addAdornment("mouseHover", nodeHoverAdornment);
        }
    }
)
