import { GraphQLAggregate } from './graphql-aggregate.interface';

export interface GraphQLType {
    aggregateFunction?: GraphQLAggregate,
    serialiser?: any,
    validateFunctions?: Array<any>,
    class?: string,
    index?: number,
    editing?: boolean,
    node?: string,
    type: string
}
