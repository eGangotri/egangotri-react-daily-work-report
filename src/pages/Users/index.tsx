import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useRecoilState } from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import LoginPanel from "pages/LoginPanel";
import { ADMIN_ROLE, BASIC_ROLE, CATALOGER_ROLE, QA_ROLE, SUPERADMIN_ROLE } from 'mirror/FrontEndBackendCommonConsts'
import Spinner from "widgets/Spinner";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { addUserToBackend, deleteUserFromBackend, listUsers, patchUserInBackend, UserListItem } from "api/service/UserService";
import { Navigate } from "react-router-dom";

const roles = [BASIC_ROLE, CATALOGER_ROLE, QA_ROLE, ADMIN_ROLE]

const maskPassword = (pw?: string) => {
    if (!pw || pw.length === 0) return "********";
    return pw.charAt(0) + '*'.repeat(Math.max(0, pw.length - 1));
}

const Users: React.FC = () => {
    const [_isLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole] = useRecoilState(loggedUserRole);
    const [_loggedUserPassword] = useRecoilState(loggedUserPassword);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<UserListItem[]>([]);

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [formUsername, setFormUsername] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formRole, setFormRole] = useState<string>(roles[0]);
    const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
    const canManage = _isLoggedIn && (_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE);

    const load = async () => {
        setIsLoading(true);
        try {
            const data = await listUsers({});
            setRows(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onAdd = async () => {
        setIsLoading(true);
        try {
            const resp = await addUserToBackend({
                username: formUsername,
                password: formPassword,
                role: formRole,
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            });
            if ((resp as any)?.error) {
                alert((resp as any).error);
                return;
            }
            setAddOpen(false);
            setFormUsername("");
            setFormPassword("");
            setFormRole(roles[0]);
            await load();
        } finally {
            setIsLoading(false);
        }
    };

    const onEdit = async () => {
        if (!editingUser) return;
        setIsLoading(true);
        try {
            const body: any = {
                username: editingUser.username, // backend checks req.body.username
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            };
            if (formRole) body.role = formRole;
            if (formPassword) body.password = formPassword;
            const resp = await patchUserInBackend(editingUser.username, body);
            if ((resp as any)?.error) {
                alert((resp as any).error);
                return;
            }
            setEditOpen(false);
            setEditingUser(null);
            setFormPassword("");
            await load();
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async (username: string) => {
        if (!confirm(`Delete user ${username}?`)) return;
        setIsLoading(true);
        try {
            const resp = await deleteUserFromBackend({
                username,
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
        { field: 'username', headerName: 'Username', flex: 1, minWidth: 160 },
        { field: 'password', headerName: 'Password', flex: 1, minWidth: 160, sortable: false, filterable: false, valueGetter: () => maskPassword() },
        { field: 'role', headerName: 'Role', flex: 1, minWidth: 120 },
        {
            field: 'actions', headerName: 'Actions', sortable: false, filterable: false, width: 220,
            renderCell: (params: GridRenderCellParams<UserListItem>) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => {
                        setEditingUser(params.row);
                        setFormRole(params.row.role);
                        setFormPassword("");
                        setEditOpen(true);
                    }} disabled={!canManage}>Edit</Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row.username)} disabled={!canManage}>Delete</Button>
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
                    <Typography variant="h6">Users</Typography>
                    <Button variant="contained" onClick={() => setAddOpen(true)}>Add User</Button>
                </Box>
            )}
            <Box sx={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={rows.map((r, i) => ({ id: r._id || r.username || i, ...r }))}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                />
            </Box>

            {/* Add Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add User</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Username" value={formUsername} onChange={e => setFormUsername(e.target.value)} size="small" />
                    <TextField label="Password" type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} size="small" />
                    <FormControl size="small">
                        <InputLabel id="role-add">Role</InputLabel>
                        <Select labelId="role-add" label="Role" value={formRole} onChange={(e) => setFormRole(String(e.target.value))}>
                            {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={onAdd} disabled={!canManage}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User {editingUser?.username}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Username" value={editingUser?.username || ''} size="small" disabled />
                    <TextField label="Password (leave blank to keep)" type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} size="small" />
                    <FormControl size="small">
                        <InputLabel id="role-edit">Role</InputLabel>
                        <Select labelId="role-edit" label="Role" value={formRole} onChange={(e) => setFormRole(String(e.target.value))}>
                            {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={onEdit} disabled={!canManage}>Save</Button>
                </DialogActions>
            </Dialog>
        </Stack>
        )
    );
}
export default Users;