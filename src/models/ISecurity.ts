export interface ISecurity {
    CanView: boolean;
    CanEdit: boolean;
    CanSubmitSessions: boolean;
    CanAttend: boolean;
    CanManage: boolean;
    IsAdmin: boolean;
    UserId: number;
}