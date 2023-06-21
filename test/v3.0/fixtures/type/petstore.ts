export interface listPetsReply200 {
}
export interface listPetsReplyDefault {
    code: number;
    message: string;
}
export interface createPetsReplyDefault {
    code: number;
    message: string;
}
export interface showPetByIdReply200 {
    id: number;
    name: string;
    tag: string;
}
export interface showPetByIdReplyDefault {
    code: number;
    message: string;
}
