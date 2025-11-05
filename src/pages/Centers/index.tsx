import React, { useEffect, useMemo, useState } from "react";
import { 
    Box, 
    Stack, 
    TextField, 
    Button, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import { useRecoilState } from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import LoginPanel from "pages/LoginPanel";
import { ADMIN_ROLE, SUPERADMIN_ROLE } from 'mirror/FrontEndBackendCommonConsts';
import Spinner from "widgets/Spinner";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { 
    addCenterToBackend, 
    deleteCenterFromBackend, 
    editCenterInBackend, 
    listCenters, 
    CenterListItem 
} from "api/service/CenterService";
import { Navigate } from "react-router-dom";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";

const Centers: React.FC = () => {
    const [_isLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole] = useRecoilState(loggedUserRole);
    const [_loggedUserPassword] = useRecoilState(loggedUserPassword);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<CenterListItem[]>([]);

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [formCenterName, setFormCenterName] = useState("");
    const [formLibraries, setFormLibraries] = useState<string[]>([]);
    const [newLibrary, setNewLibrary] = useState("");
    const [editingCenter, setEditingCenter] = useState<CenterListItem | null>(null);
    
    const canManage = _isLoggedIn && (_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE);

    const load = async () => {
        setIsLoading(true);
        try {
            const data = await listCenters({});
            setRows(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleAddLibrary = () => {
        if (newLibrary.trim() && !formLibraries.includes(newLibrary.trim())) {
            setFormLibraries([...formLibraries, newLibrary.trim()]);
            setNewLibrary("");
        }
    };

    const handleRemoveLibrary = (library: string) => {
        setFormLibraries(formLibraries.filter(lib => lib !== library));
    };

    const onAdd = async () => {
        if (!formCenterName.trim()) {
            alert("Center name is required");
            return;
        }
        setIsLoading(true);
        try {
            const resp = await addCenterToBackend({
                centerName: formCenterName,
                libraries: formLibraries,
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            });
            if ((resp as any)?.error) {
                alert((resp as any).error);
                return;
            }
            setAddOpen(false);
            setFormCenterName("");
            setFormLibraries([]);
            await load();
        } finally {
            setIsLoading(false);
        }
    };

    const onEdit = async () => {
        if (!editingCenter) return;
        setIsLoading(true);
        try {
            const body: any = {
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            };
            if (formCenterName) body.centerName = formCenterName;
            if (formLibraries) body.libraries = formLibraries;
            
            const resp = await editCenterInBackend(editingCenter._id!, body);
            if ((resp as any)?.error) {
                alert((resp as any).error);
                return;
            }
            setEditOpen(false);
            setEditingCenter(null);
            setFormCenterName("");
            setFormLibraries([]);
            await load();
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async (centerId: string, centerName: string) => {
        if (!confirm(`Delete center "${centerName}"?`)) return;
        setIsLoading(true);
        try {
            const resp = await deleteCenterFromBackend({
                centerId,
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            });
            if ((resp as any)?.error) {
                alert((resp as any).error);
                return;
            }
            await load();
        } finally {
            setIsLoading(false);
        }
    };

    const columns: GridColDef[] = useMemo(() => [
        { 
            field: 'centerName', 
            headerName: 'Center Name', 
            flex: 1, 
            minWidth: 200 
        },
        { 
            field: 'libraries', 
            headerName: 'Libraries', 
            flex: 2, 
            minWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<CenterListItem>) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', py: 1 }}>
                    {params.row.libraries.length > 0 ? (
                        params.row.libraries.map((lib, idx) => (
                            <Chip 
                                key={idx} 
                                label={lib} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">No libraries</Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'actions', 
            headerName: 'Actions', 
            sortable: false, 
            filterable: false, 
            width: 220,
            renderCell: (params: GridRenderCellParams<CenterListItem>) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => {
                            setEditingCenter(params.row);
                            setFormCenterName(params.row.centerName);
                            setFormLibraries([...params.row.libraries]);
                            setEditOpen(true);
                        }} 
                        disabled={!canManage}
                    >
                        Edit
                    </Button>
                    <Button 
                        size="small" 
                        color="error" 
                        variant="outlined" 
                        onClick={() => onDelete(params.row._id!, params.row.centerName)} 
                        disabled={!canManage}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ], [canManage]);

    return (
        !_isLoggedIn || !canManage ? (
            <Navigate to="/" replace />
        ) : (
        <Stack spacing={2}>
            {isLoading && <Spinner />}
            <Box>
                <LoginPanel />
            </Box>
            {canManage && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Scanning Centers</Typography>
                    <Button variant="contained" onClick={() => setAddOpen(true)}>Add Center</Button>
                </Box>
            )}
            <Box sx={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={rows.map((r, i) => ({ id: r._id || i, ...r }))}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                    getRowHeight={() => 'auto'}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            py: 1,
                        },
                    }}
                />
            </Box>

            {/* Add Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Scanning Center</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField 
                        label="Center Name" 
                        value={formCenterName} 
                        onChange={e => setFormCenterName(e.target.value)} 
                        size="small"
                        fullWidth
                    />
                    
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Libraries</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField 
                                label="Add Library" 
                                value={newLibrary} 
                                onChange={e => setNewLibrary(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddLibrary();
                                    }
                                }}
                                size="small"
                                fullWidth
                            />
                            <Tooltip title="Add Library">
                                <IconButton 
                                    color="primary" 
                                    onClick={handleAddLibrary}
                                    disabled={!newLibrary.trim()}
                                >
                                    <FaPlus />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: 40 }}>
                            {formLibraries.length > 0 ? (
                                formLibraries.map((lib, idx) => (
                                    <Chip 
                                        key={idx} 
                                        label={lib} 
                                        size="small"
                                        onDelete={() => handleRemoveLibrary(lib)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No libraries added</Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddOpen(false);
                        setFormCenterName("");
                        setFormLibraries([]);
                        setNewLibrary("");
                    }}>Cancel</Button>
                    <Button variant="contained" onClick={onAdd} disabled={!canManage}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Scanning Center</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField 
                        label="Center Name" 
                        value={formCenterName} 
                        onChange={e => setFormCenterName(e.target.value)} 
                        size="small"
                        fullWidth
                    />
                    
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Libraries</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField 
                                label="Add Library" 
                                value={newLibrary} 
                                onChange={e => setNewLibrary(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddLibrary();
                                    }
                                }}
                                size="small"
                                fullWidth
                            />
                            <Tooltip title="Add Library">
                                <IconButton 
                                    color="primary" 
                                    onClick={handleAddLibrary}
                                    disabled={!newLibrary.trim()}
                                >
                                    <FaPlus />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: 40 }}>
                            {formLibraries.length > 0 ? (
                                formLibraries.map((lib, idx) => (
                                    <Chip 
                                        key={idx} 
                                        label={lib} 
                                        size="small"
                                        onDelete={() => handleRemoveLibrary(lib)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No libraries added</Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setEditOpen(false);
                        setEditingCenter(null);
                        setFormCenterName("");
                        setFormLibraries([]);
                        setNewLibrary("");
                    }}>Cancel</Button>
                    <Button variant="contained" onClick={onEdit} disabled={!canManage}>Save</Button>
                </DialogActions>
            </Dialog>
        </Stack>
        )
    );
}

export default Centers;
