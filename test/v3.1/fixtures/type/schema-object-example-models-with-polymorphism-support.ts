export interface PetSchema {
    name: string;
    petType: string;
}
export interface CatSchema {
    name?: string;
    petType: string;
    // The measured skill for hunting
    huntingSkill: "clueless" | "lazy" | "adventurous" | "aggressive";
}
export interface DogSchema {
    name?: string;
    petType: string;
    // The measured skill for hunting
    huntingSkill?: "clueless" | "lazy" | "adventurous" | "aggressive";
    // the size of the pack the dog is from
    packSize: number;
}
