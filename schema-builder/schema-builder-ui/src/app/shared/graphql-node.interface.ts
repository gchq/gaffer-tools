import { Node } from 'vis';

export interface GraphQLNode extends Node {
    entities?: Array<any>
}
