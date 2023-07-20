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
import AllCatalogReportStats from 'utils/AllCatalogReportStats';
import { CatalogWorkReportType } from 'mirror/catalogWorkReportTypes';
import { pushCatReportToServer } from 'api/service/DailyCatalogReportService';

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

interface SentCatalogReportDialogProps {
    catReport: CatalogWorkReportType;
    setCatReport: React.Dispatch<React.SetStateAction<CatalogWorkReportType>>;
    snackBarMsg: [string, React.ReactNode];
    setSnackBarMsg:  React.Dispatch<React.SetStateAction<[string, React.ReactNode]>>;
    password: string;
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

const SendCatalogReportToServerDialog: React.FC<SentCatalogReportDialogProps> = ({ catReport, setCatReport, snackBarMsg, setSnackBarMsg, password }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const copyResults = (msg: string = "") => {
        navigator.clipboard.writeText(msg || AllCatalogReportStats.toString(catReport));
    };


    const prepareCatReportForPush = async () => {
        handleClose();
        console.log(`dailyCatReport ${JSON.stringify(catReport)}`);
        const jsonResp = await pushCatReportToServer(catReport, password);
        const respKey = Object.keys(jsonResp)[0];
        const respVal = (<div>Report Copied to Clipboard<br></br>{Object.values(jsonResp)[0]}</div>);
        setSnackBarMsg([respKey, respVal]);
        if (jsonResp.success || jsonResp.warning) {
            copyResults();
        }
        else {
            copyResults("There was an error sending data to Server. So nothing copied. Pls. notify management");
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} disabled={AllCatalogReportStats.hasAllRequiredFields(catReport)}>
                Copy and Send Catalog Report
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
                        The Pdf Report will be automatically copied to your clipboard,
                        just Ctrl-V on your respective whatsapp group and it will be shared.
                    </Typography>
                    <Typography gutterBottom>

                    </Typography>
                    <Typography sx={{ fontSize: "20px" }} gutterBottom>
                        ये नीचे का बटन क्लिक करने के बाद आपकी DAILY REPORT SERVER पे भेज दी जायेगी
                        और आपकी रिपोर्ट भी आपके Clipboard पर कापी हो जाएगी
                        इस को अपने  whatsapp group में Ctrl-V कर के शेयर करें
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        autoFocus 
                        onClick={prepareCatReportForPush}>
                        Send-Report-and-Copy
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default SendCatalogReportToServerDialog