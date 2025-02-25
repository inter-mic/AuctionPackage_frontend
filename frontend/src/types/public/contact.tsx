export interface Contact {
    name: string | null;
    nameKana: string | null;
    tel: string | null;
    title: string | null;
    text: string | null;
    mail: string | null;
}


export const initialContact: Contact = {
    name: null,
    nameKana: null,
    tel: null,
    title: null,
    text: null,
    mail: null,
};