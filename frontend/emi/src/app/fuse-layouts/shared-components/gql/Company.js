import { gql } from 'apollo-boost';

export const OrganizationMngCompany = (variables) => ({
    query: gql`
            query OrganizationMngCompany($id: ID!, $organizationId: String!){
                OrganizationMngCompany(id:$id, organizationId:$organizationId){
                    id,name,logoUrl,
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})