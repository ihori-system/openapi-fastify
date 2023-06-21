export interface getUserByNameReply200 {
    username: string;
    uuid: string;
}
export interface getRepositoriesByOwnerReply200 {
}
export interface getRepositoryReply200 {
    slug: string;
    owner: {
        username: string;
        uuid: string;
    };
}
export interface getPullRequestsByRepositoryReply200 {
}
export interface getPullRequestsByIdReply200 {
    id: number;
    title: string;
    repository: {
        slug: string;
        owner: {
            username: string;
            uuid: string;
        };
    };
    author: {
        username: string;
        uuid: string;
    };
}
