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
export interface deletePetParams {
    // Pet id to delete
    "petId": number;
}
export interface deletePetHeaders {
    "api_key"?: string;
}
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
export interface deleteOrderParams {
    // ID of the order that needs to be deleted
    "orderId": number;
}
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
export interface loginUserQuerystring {
    // The user name for login
    "username"?: string;
    // The password for login in clear text
    "password"?: string;
}
export type loginUserReply200 = string;
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
export interface deleteUserParams {
    // The name that needs to be deleted
    "username": string;
}
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
