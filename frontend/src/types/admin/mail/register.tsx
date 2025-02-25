export type TemplateData = {
    templateId: number | null;
    templateSetsumei: string | null;
    subject: string | null;
    bodyPart1: string | null;
    bodyPart2: string | null;
    bodyPart3: string | null;
    bodyPart4: string | null;
    body: string | null;
}

export type ShomeiData = {
    shomeiId: number | null;
    shomei: string | null;
}
export const initialShomeiData: ShomeiData = {
    shomeiId:null,
    shomei:null
}
