export interface updatePetReply200 {
    id?: number;
    name: string;
    category?: {
        id?: number;
        name?: string;
    };
    photoUrls: string[];
    tags?: {
        id?: number;
        name?: string;
    }[];
    status?: "available" | "pending" | "sold";
}
