
export type AddUserType = {
    username: string,
    password: string,
    role: string,
    superadmin_user: string,
    superadmin_password: string
}


export type BackendResponseType = {
    success?: string;
    error?: string;
    warning?: string;
    //[key: string]: any;
};

export type ScanningCenterType = {
    centerName?: string;
    libraries?: string[];
};



