import { GDriveUploadWorkReportType } from 'mirror/types';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

export const SUCCESS_MSG = "Report Sent succcessfully to Server. Now paste report in your whatsapp group";
export const ERROR_MSG = "Report not Sent to Server. Pls. notify management";

export interface GDriveReportDialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export interface SendGDriveReportToServerDialog {
    gDriveUploadData: GDriveUploadWorkReportType;
    setGDriveUploadData: React.Dispatch<React.SetStateAction<GDriveUploadWorkReportType>>;
    snackBarMsg: [string, React.ReactNode];
    setSnackBarMsg: React.Dispatch<React.SetStateAction<[string, React.ReactNode]>>;
    password: string;
}


export const GDRiveReportBootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
