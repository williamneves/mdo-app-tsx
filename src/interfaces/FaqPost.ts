import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

export type FaqPostCategory = "vendedores" | "streets" | "gerais" | "ajustesDeConta" | "clientes"
export default interface FaqPost extends Partial<SanityDefaultObject> {
    inactive?: boolean;
    question: string;
    answer: any;
    description: string;
    thumbnail: any;
    category: FaqPostCategory[];
    tags: string[];
}