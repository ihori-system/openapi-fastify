export interface getUserByNameReply200 {
    username?: string;
    uuid?: string;
}
export type getRepositoriesByOwnerReply200 = {
    slug?: string;
    owner?: {
        username?: string;
        uuid?: string;
    };
}[];
export interface getRepositoryReply200 {
    slug?: string;
    owner?: {
        username?: string;
        uuid?: string;
    };
}
export type getPullRequestsByRepositoryReply200 = {
    id?: number;
    title?: string;
    repository?: {
        slug?: string;
        owner?: {
            username?: string;
            uuid?: string;
        };
    };
    author?: {
        username?: string;
        uuid?: string;
    };
}[];
export interface getPullRequestsByIdReply200 {
    id?: number;
    title?: string;
    repository?: {
        slug?: string;
        owner?: {
            username?: string;
            uuid?: string;
        };
    };
    author?: {
        username?: string;
        uuid?: string;
    };
}
