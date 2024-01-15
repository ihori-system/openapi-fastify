export interface getUserByNameParams {
    "username": string;
}
export interface getUserByNameReply200 {
    username?: string;
    uuid?: string;
}
export interface getRepositoriesByOwnerParams {
    "username": string;
}
export type getRepositoriesByOwnerReply200 = {
    slug?: string;
    owner?: {
        username?: string;
        uuid?: string;
    };
}[];
export interface getRepositoryParams {
    "username": string;
    "slug": string;
}
export interface getRepositoryReply200 {
    slug?: string;
    owner?: {
        username?: string;
        uuid?: string;
    };
}
export interface getPullRequestsByRepositoryQuerystring {
    "state"?: "open" | "merged" | "declined";
}
export interface getPullRequestsByRepositoryParams {
    "username": string;
    "slug": string;
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
export interface getPullRequestsByIdParams {
    "username": string;
    "slug": string;
    "pid": string;
}
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
export interface mergePullRequestParams {
    "username": string;
    "slug": string;
    "pid": string;
}
export interface userSchema {
    username?: string;
    uuid?: string;
}
export interface repositorySchema {
    slug?: string;
    owner?: {
        username?: string;
        uuid?: string;
    };
}
export interface pullrequestSchema {
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
