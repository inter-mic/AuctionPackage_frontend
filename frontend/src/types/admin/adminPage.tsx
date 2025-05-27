export interface PageProps {
    children: React.ReactNode;
    userName: string | null;
    pageTitle: string | null;
    faviconImagePath: string | null;
    logoImagePath: string | null;
    kengen: Kengen[];
    optionInvoice: boolean | false;
    optionLiveMessage: boolean | false;
    optionLiveYoutube: boolean | false;
}

export interface Kengen {
    screenId: number;
    kengenKbn: number;
}