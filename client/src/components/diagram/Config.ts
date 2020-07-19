import * as go from 'gojs';
import {ObjectData} from 'gojs';

import nodeTemplate from './ClassNodeTemplate'
import linkTemplate from './LinkTemplate'

export default function initDiagram() {
    // const $ = go.GraphObject.make;
    // const diagram = $(go.Diagram, {
    //     'undoManager.isEnabled': true,
    //     'toolManager.hoverDelay': 0,
    //     'undoManager.maxHistoryLength': 10,
    //     'clickCreatingTool.archetypeNodeData': {text: 'new node', color: 'lightblue'},
    //     model: $(go.TreeModel,
    //         // {
    //         //     // IMPORTANT! Must be defined for GraphLinksModel merges and data sync.
    //         //     linkKeyProperty: 'key'
    //         // }
    //         ),
    //     layout: $(go.TreeLayout, { nodeSpacing: 3 }),
    //     nodeTemplate,
    //     linkTemplate,
    // });
    const $ = go.GraphObject.make;
    const diagram =
        $(go.Diagram,
            {
                'undoManager.isEnabled': true,  // must be set to allow for model change listening
                'clickCreatingTool.archetypeNodeData': {text: 'new node', color: 'lightblue'},
                layout: $(go.TreeLayout),
                model: $(go.GraphLinksModel,
                    {
                        linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                        // positive keys for nodes
                        makeUniqueKeyFunction: (m: any, data: ObjectData) => {
                            let k = data.key || 1;
                            while (m.findNodeDataForKey(k)) k++;
                            data.key = k;
                            return k;
                        },
                        // negative keys for links
                        makeUniqueLinkKeyFunction: (m: any, data: ObjectData) => {
                            let k = data.key || -1;
                            while (m.findLinkDataForKey(k)) k--;
                            data.key = k;
                            return k;
                        }
                    }),
                nodeTemplate,
                linkTemplate,
            });

    return diagram;
}
