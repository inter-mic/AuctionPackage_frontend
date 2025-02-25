export interface KengenGroupSearch{
    kengenId: number;
    kengenName: string;
}

export interface SearchParams {
    kengenId?: string;
}

export interface Result {
    screenId: number;
    screenName: string;
    kengenId: number;
    kengenKbn: number;
    kengenName: string;
    [key: string]: any; 
}