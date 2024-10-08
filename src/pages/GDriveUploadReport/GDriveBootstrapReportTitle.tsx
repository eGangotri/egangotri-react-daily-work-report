import React from "react";
import { DialogTitle, IconButton } from "@mui/material";
import { GDriveReportDialogTitleProps } from "./Utils";
import { FaRegWindowClose } from "react-icons/fa";

export function GDriveReportBootstrapDialogTitle(props: GDriveReportDialogTitleProps) {
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
