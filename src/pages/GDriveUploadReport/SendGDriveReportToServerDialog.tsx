import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import AllGDriveUploadLinkReportStats from 'utils/AllGDriveUploadLinkReportStats';
import { pushGDriveReportToServer } from 'api/service/GDriveUploadReportService';
import { GDRiveReportBootstrapDialog, SendGDriveReportToServerDialog } from './Utils';
import { GDriveUploadWorkReportType } from 'mirror/types';
import { GDriveReportBootstrapDialogTitle } from './GDriveBootstrapReportTitle';


const SendGDriveReportDialog: React.FC<SendGDriveReportToServerDialog> = ({ gDriveUploadData, 
    setGDriveUploadData, 
    snackBarMsg,
     setSnackBarMsg, 
     password }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const copyResultsToClipboard = (msg: string = "") => {
        navigator.clipboard.writeText(msg || AllGDriveUploadLinkReportStats.toString(gDriveUploadData));
    };


    const prepareReportForPush = async () => {
        handleClose();
        const gDriveUploadReport: GDriveUploadWorkReportType =
            AllGDriveUploadLinkReportStats.convertStatsToQAReportTypeObject(gDriveUploadData);
        console.log(`qaReport ${JSON.stringify(gDriveUploadReport)}`);
        const jsonResp = await pushGDriveReportToServer(gDriveUploadReport, password);
        const respKey = Object.keys(jsonResp)[0];
        const respVal = (<div>Report Copied to Clipboard<br></br>{Object.values(jsonResp)[0]}</div>);
        setSnackBarMsg([respKey, respVal]);
        if (jsonResp.success || jsonResp.warning) {
            copyResultsToClipboard();
        }
        else {
            copyResultsToClipboard("There was an error sending data to Server. So nothing copied. Pls. notify management");
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} disabled={!AllGDriveUploadLinkReportStats.isValidGDriveUploadReport(gDriveUploadData)}>
                Copy and G-Drive Upload Send Report
            </Button>
            <GDRiveReportBootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <GDriveReportBootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Send Report
                </GDriveReportBootstrapDialogTitle>
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
            </GDRiveReportBootstrapDialog>
        </div>
    );
}

export default SendGDriveReportDialog