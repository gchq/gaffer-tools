import { GraphQLProperty } from './graphql-property.interface';

export interface GraphQLEntity {
    id: string,
    name: string,
    properties?: Array<GraphQLProperty>,
    editing?: boolean
}
