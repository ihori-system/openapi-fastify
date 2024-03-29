export interface updatePetBody {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
export type updatePetReply400 = undefined;
export type updatePetReply404 = undefined;
export type updatePetReply405 = undefined;
export interface addPetBody {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
export interface addPetReply200 {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
export type addPetReply405 = undefined;
export interface findPetsByStatusQuerystring {
    // Status values that need to be considered for filter
    "status"?: "available" | "pending" | "sold";
}
export type findPetsByStatusReply200 = {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}[];
export type findPetsByStatusReply400 = undefined;
export interface findPetsByTagsQuerystring {
    // Tags to filter by
    "tags"?: string[];
}
export type findPetsByTagsReply200 = {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}[];
export type findPetsByTagsReply400 = undefined;
export interface getPetByIdParams {
    // ID of pet to return
    "petId": number;
}
export interface getPetByIdReply200 {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
export type getPetByIdReply400 = undefined;
export type getPetByIdReply404 = undefined;
export interface updatePetWithFormQuerystring {
    // Name of pet that needs to be updated
    "name"?: string;
    // Status of pet that needs to be updated
    "status"?: string;
}
export interface updatePetWithFormParams {
    // ID of pet that needs to be updated
    "petId": number;
}
export type updatePetWithFormReply405 = undefined;
export interface deletePetParams {
    // Pet id to delete
    "petId": number;
}
export interface deletePetHeaders {
    "api_key"?: string;
}
export type deletePetReply400 = undefined;
export interface uploadFileQuerystring {
    // Additional Metadata
    "additionalMetadata"?: string;
}
export interface uploadFileParams {
    // ID of pet to update
    "petId": number;
}
export interface uploadFileReply200 {
    code?: number;
    type?: string;
    message?: string;
}
export interface getInventoryReply200 {
}
export interface placeOrderBody {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    // Order Status
    status?: "placed" | "approved" | "delivered";
    complete?: boolean;
}
export interface placeOrderReply200 {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    // Order Status
    status?: "placed" | "approved" | "delivered";
    complete?: boolean;
}
export type placeOrderReply405 = undefined;
export interface getOrderByIdParams {
    // ID of order that needs to be fetched
    "orderId": number;
}
export interface getOrderByIdReply200 {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    // Order Status
    status?: "placed" | "approved" | "delivered";
    complete?: boolean;
}
export type getOrderByIdReply400 = undefined;
export type getOrderByIdReply404 = undefined;
export interface deleteOrderParams {
    // ID of the order that needs to be deleted
    "orderId": number;
}
export type deleteOrderReply400 = undefined;
export type deleteOrderReply404 = undefined;
export interface createUserBody {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export interface createUserReplyDefault {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export interface createUsersWithListInputBody {
}
export interface createUsersWithListInputReply200 {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export type createUsersWithListInputReplyDefault = undefined;
export interface loginUserQuerystring {
    // The user name for login
    "username"?: string;
    // The password for login in clear text
    "password"?: string;
}
export type loginUserReply200 = string;
export type loginUserReply400 = undefined;
export type logoutUserReplyDefault = undefined;
export interface getUserByNameParams {
    // The name that needs to be fetched. Use user1 for testing.
    "username": string;
}
export interface getUserByNameReply200 {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export type getUserByNameReply400 = undefined;
export type getUserByNameReply404 = undefined;
export interface updateUserBody {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export interface updateUserParams {
    // name that need to be deleted
    "username": string;
}
export type updateUserReplyDefault = undefined;
export interface deleteUserParams {
    // The name that needs to be deleted
    "username": string;
}
export type deleteUserReply400 = undefined;
export type deleteUserReply404 = undefined;
export interface OrderSchema {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    // Order Status
    status?: "placed" | "approved" | "delivered";
    complete?: boolean;
}
export interface CustomerSchema {
    id?: number;
    username?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    }[];
}
export interface AddressSchema {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}
export interface CategorySchema {
    id?: number;
    name?: string;
}
export interface UserSchema {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    // User Status
    userStatus?: number;
}
export interface TagSchema {
    id?: number;
    name?: string;
}
export interface PetSchema {
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
    // pet status in the store
    status?: "available" | "pending" | "sold";
}
export interface ApiResponseSchema {
    code?: number;
    type?: string;
    message?: string;
}
