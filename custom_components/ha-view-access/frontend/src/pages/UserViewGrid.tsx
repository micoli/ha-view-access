import * as React from 'react';
import {JSX, useEffect, useState} from 'react';
import {fetchAuthList, fetchLovelaceDashBoard, fetchLovelacePanels, saveLovelaceDashBoard} from '../websockets';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {User} from '../userViewsTypes';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {Checkbox, IconButton} from '@mui/material';
import Button from "@mui/material/Button";
import MD5 from "crypto-js/md5";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

interface Dashboard {
    url: string | null,
    raw: any,
    views: {
        title: string,
        index: number,
        visibility: string[]
    }[]
}

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const UserViewGrid: () => JSX.Element = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [snackBarMessage, setSnackBarMessage] = React.useState<string|null>(null);

    const handleCloseSnackbar = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarMessage(null);
    };

    const getUsers = async () => {
        const users = (await fetchAuthList()).filter(user => !user.system_generated).sort((u1, u2) => (u1.username ?? '') < (u2.username ?? '') ? -1 : 1);
        setUsers(users);
        setSelectedUserIds(users.map(user => user.id));
    };

    const getDashboards = async (): Promise<Dashboard[]> => {
        const allUserIds = users.map(user => user.id);
        const rawPanels = await fetchLovelacePanels();
        const lovelacePanels: (string | null)[] = [null];
        for (const rawPanelName in rawPanels) {
            const rawPanel = rawPanels[rawPanelName];
            if (rawPanel.component_name != 'lovelace') {
                continue;
            }
            if (rawPanel.url_path == 'lovelace' || rawPanel.url_path == 'map' || rawPanel.url_path == 'profile') {
                continue;
            }
            lovelacePanels.push(rawPanel.url_path);
        }
        return await Promise.all<Dashboard>(lovelacePanels.map((urlPath: string | null) => new Promise((resolve, reject) => {
            fetchLovelaceDashBoard(urlPath).then((raw) => {
                resolve({
                    url: urlPath,
                    raw,
                    views: raw.views.map(((view, index) => {
                        return {
                            title: view.title,
                            index,
                            visibility: (view.visible === undefined) ? allUserIds : view.visible.map(value => value.user),
                        };
                    }))
                });
            });
        })));
    };

    const refreshDashboards = async () =>{
        setDashboards(await getDashboards());
    }

    useEffect(() => {
        const init = async () => {
            await getUsers();
            await refreshDashboards();
        }
        init();
    }, []);

    if (dashboards.length === 0) {
        return <Box>Loading</Box>;
    }

    const cloneDashboardAndSanitizeVisibility = (initialDashboard: Dashboard, viewIndex: number) => {
        const dashboard = JSON.parse(JSON.stringify(initialDashboard.raw));
        dashboard.views[viewIndex].visible = dashboard.views[viewIndex].visible ?? users.map(user => ({user: user.id}));
        return dashboard;
    }

    const dashboardHasChangedSignature = async (dashboard: Dashboard) =>{
        let initialDashboardHash = JSON.stringify((await getDashboards()).filter(dash => dash.url === dashboard.url)[0].raw);
        let dashBoardHash = JSON.stringify(dashboard.raw);
        return MD5(initialDashboardHash).toString() !== MD5(dashBoardHash).toString();
    }


    const addUserFromView = async (initialDashboard: Dashboard, viewIndex: number, userId: string) => {
        const dashboard = cloneDashboardAndSanitizeVisibility(initialDashboard, viewIndex);
        if (await dashboardHasChangedSignature(initialDashboard)){
            setSnackBarMessage('Has changed')
            await refreshDashboards();
            return;
        }
        dashboard.views[viewIndex].visible.push({user: userId});
        await saveLovelaceDashBoard(dashboard)
        await refreshDashboards();
    };
    const removeUserFromView = async (initialDashboard: Dashboard, viewIndex: number, userId: string) => {
        const dashboard = cloneDashboardAndSanitizeVisibility(initialDashboard, viewIndex);
        if (await dashboardHasChangedSignature(initialDashboard)){
            setSnackBarMessage('Has changed')
            await refreshDashboards();
            return;
        }
        dashboard.views[viewIndex].visible = dashboard.views[viewIndex].visible.filter((visibility: {
            user: string
        }) => {
            return visibility.user !== userId
        })
        await saveLovelaceDashBoard(dashboard)
        await refreshDashboards();
    };
    return (
        <Box>
            <Snackbar
                open={snackBarMessage!==null}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Error"
                action={<React.Fragment>
                    <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
                        {snackBarMessage}
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseSnackbar}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>}
            />
            {users?.map(user => <React.Fragment>
                <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => {
                        if (selectedUserIds.includes(user.id)) {
                            setSelectedUserIds(selectedUserIds.filter((u) => user.id !== u));
                            return;
                        }
                        selectedUserIds.push(user.id);
                        setSelectedUserIds(selectedUserIds.map(user => user));
                    }}
                />
                {user.name}
            </React.Fragment>)}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell/>
                            {users?.filter(user => selectedUserIds.includes(user.id)).map(user => <StyledTableCell
                                align="center">{user.username}</StyledTableCell>)}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {dashboards.map(dashboard => <>
                            <StyledTableRow>
                                <StyledTableCell>
                                    <Typography fontWeight={"bold"}>
                                        {dashboard.url ?? 'default'}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell colSpan={users?.length}>&nbsp;</StyledTableCell>
                            </StyledTableRow>
                            {dashboard.views.map(view => <StyledTableRow>
                                <StyledTableCell>- {view.title}</StyledTableCell>
                                {users?.filter(user => selectedUserIds.includes(user.id)).map(user => <StyledTableCell
                                    align="center">{view.visibility.includes(user.id)
                                    ? <Button
                                        onClick={() => removeUserFromView(dashboard, view.index, user.id)}>X</Button>
                                    : <Button onClick={() => addUserFromView(dashboard, view.index, user.id)}>-</Button>
                                }</StyledTableCell>)}
                            </StyledTableRow>)}
                        </>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserViewGrid;
