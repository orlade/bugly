import * as go from 'gojs';
import {ObjectData} from 'gojs';

import nodeTemplate from './BoxNodeTemplate'
import linkTemplate from './LinkTemplate'

export default function initDiagram() {
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
