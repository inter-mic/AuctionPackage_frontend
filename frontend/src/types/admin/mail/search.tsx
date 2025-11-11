

export interface TemplateResult {
    templateId: number;
    templateName: string;
    templateSetsumei: string;
    subject: string;
    bodyPart1: string;
    bodyPart2: string;
    bodyPart3: string;
    bodyPart4: string;
    body: string;
    updateTime: string;
    [key: string]: any; 
}

export interface ShomeiResult {
    shomeiId: number;
    shomei: string;
    updateTime: string;
    [key: string]: any; 
}
