import { Edge } from 'vis';

export interface GraphQLEdge extends Edge {
    arrows?: string,
    label?: string
}
