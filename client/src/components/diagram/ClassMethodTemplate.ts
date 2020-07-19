import convertVisibility from './Visibility';

import * as go from 'gojs';
const $ = go.GraphObject.make;

interface Parameter {
    name: string,
    type: string,
}

export default $(go.Panel, "Horizontal",
    // Visibility
    $(go.TextBlock,
        {isMultiline: false, editable: false, width: 12},
        new go.Binding("text", "visibility", convertVisibility)),

    // Name
    $(go.TextBlock,
        {isMultiline: false, editable: true},
        new go.Binding("text", "name").makeTwoWay(),
        new go.Binding("isUnderline", "scope", scope => scope[0] === 'c')),

    // Parameters
    $(go.TextBlock, "()",
        new go.Binding("text", "parameters", params => {
            return `(${params.map(({name, type} : Parameter) => `${name}: ${type}`).join(', ')})`;
        })),

    // Return type
    $(go.TextBlock, "", new go.Binding("text", "type", t => t ? ": " : "")),
    $(go.TextBlock,
        {isMultiline: false, editable: true},
        new go.Binding("text", "type").makeTwoWay())
)
