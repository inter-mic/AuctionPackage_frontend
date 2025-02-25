export interface RegisterForm{
    loginId: string;
    staffName: string;
    mail: string;
    kengenId: string;
    teishiFlg: boolean;
}

export type StaffData = {
    staffId?: number;
    loginId?: number;
    staffName?: string;
    mail?: string;
    kengenId?: string;
    teishiFlg?: boolean;
}