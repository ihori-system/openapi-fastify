export interface ErrorModelSchema {
    message: string;
    code: number;
}
export interface ExtendedErrorModelSchema {
    message?: string;
    code: number;
    rootCause: string;
}
