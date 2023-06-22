export interface listPetsQuerystring {
    // How many items to return at one time (max 100)
    limit?: number;
}
export type listPetsReply200 = {
    id: number;
    name: string;
    tag?: string;
}[];
export interface listPetsReplyDefault {
    code: number;
    message: string;
}
export interface createPetsReplyDefault {
    code: number;
    message: string;
}
export interface showPetByIdParams {
    // The id of the pet to retrieve
    petId: string;
}
export interface showPetByIdReply200 {
    id: number;
    name: string;
    tag?: string;
}
export interface showPetByIdReplyDefault {
    code: number;
    message: string;
}
export interface PetSchema {
    id: number;
    name: string;
    tag?: string;
}
export interface PetsSchema {
}
export interface ErrorSchema {
    code: number;
    message: string;
}
