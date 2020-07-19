// import propertyTemplate from './PropertyTemplate'

import * as go from 'gojs';
const $ = go.GraphObject.make;

interface TypeProps {
    [key: string]: string
}

const typeArrows: TypeProps = {
    inheritance: 'Triangle',
}

const typeArrowFills: TypeProps = {
    inheritance: 'white',
}

export default $(go.Link,
    $(go.Shape, {stroke: "black"}),
    $(go.Shape, {stroke: "black", toArrow: "standard"},
        new go.Binding("toArrow", "type", (type: string) => typeArrows[type] || "standard"),
        new go.Binding("fill", "type", (type: string) => typeArrowFills[type] || "black"),
    ),

    $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle", {fill: "#fff6"}),
        $(go.Panel, "Table",
            {defaultRowSeparatorStroke: "black"},
            $(go.TextBlock,
                {
                    textAlign: "center",
                    font: "10pt helvetica, arial, sans-serif",
                    stroke: "#000",
                    margin: 4,
                    editable: true,
                },
                new go.Binding("text", "label").makeTwoWay()),
            $(go.Panel, "Vertical", {name: "PROPERTIES"},
                new go.Binding("itemArray", "properties"),
                {
                    row: 1,
                    margin: 3,
                    stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    // itemTemplate: propertyTemplate
                }
            ),
        ),
        new go.Binding("visible", "", ({label}) => !!label),
    ),

    // ID
    $(go.TextBlock,
        {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#000",
            margin: 4
        },
        new go.Binding("text", "id"),
        {
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
        }
    ),
)
