import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FaRegWindowClose } from 'react-icons/fa';
import AllPdfStats from 'vo/AllPdfStats';
import { DailyWorkReportType } from 'types/dailyyWorkReportTypes';
import { pushReportToServer } from "api/service/callApi";
import  {AlertColor } from "@mui/material/Alert/Alert";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const SUCCESS_MSG = "Report Sent succcessfully to Server. Now paste report in your whatsapp group";
export const ERROR_MSG = "Report not Sent to Server. Pls. notify management";

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

interface SendReportDialogProps {
    pdfData: AllPdfStats;
    setPdfData: React.Dispatch<React.SetStateAction<AllPdfStats>>;
    snackBarMsg: string[];
    setSnackBarMsg:React.Dispatch<React.SetStateAction<string[]>>;
    password:string;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <FaRegWindowClose />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const SendReportDialog: React.FC<SendReportDialogProps> = ({ pdfData,setPdfData,snackBarMsg,setSnackBarMsg,password }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const copyResults = (msg:string = "") => {
        // TODO: Toast Message that Results have been copied.
        navigator.clipboard.writeText(msg || AllPdfStats.toString(pdfData));
      };
    

    const prepareReportForPush = async () => {
        handleClose();
        const dailyReport: DailyWorkReportType =
            AllPdfStats.convertPdfStatsToDailyWorkReportTypeObject(pdfData);
        console.log(`dailyReport ${JSON.stringify(dailyReport)}`);
        const jsonResp = await pushReportToServer(dailyReport,password);
        const resp = jsonResp.success || jsonResp.warning || jsonResp.error || ""
        setSnackBarMsg([Object.values(jsonResp)[0], resp]);
        if(jsonResp.success || jsonResp.warning){
            copyResults();
        }
        else {
            copyResults("There was an error sending data to Server. So nothing copied. Pls. notify management");
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} disabled={AllPdfStats.isEmpty(pdfData)}>
                Copy and Send Report
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Send Report
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ fontSize: "20px" }} gutterBottom>
                        Once you click the Send-Report-and-Copy Button below, your report will be sent to the Server.
                        The Pdf Report will also be copied.
                        Place this Pdf Report in your respective whatsapp group.
                    </Typography>
                    <Typography gutterBottom>

                    </Typography>
                    <Typography sx={{ fontSize: "20px" }} gutterBottom>
                        ये नीचे का बटन क्लिक करने के बाद आपकी DAILY REPORT SERVER पे भेज दी जायेगी
                        और आपकी रिपोर्ट भी आपके Clipboard पार कापी हो जाएगी
                        इस को अपने  whatsapp group में शेयर करें
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        autoFocus onClick={prepareReportForPush}>
                        Send-Report-and-Copy
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default SendReportDialog