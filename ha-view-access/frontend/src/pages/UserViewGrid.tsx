import * as React from 'react';
import { JSX, useEffect, useState } from 'react';
import { fetchAuthList, fetchConfig, fetchLovelaceDashBoard, fetchLovelacePanels, saveConfig } from '../websockets';
import Box from '@mui/material/Box';
import { User } from '../userViewsTypes';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Checkbox } from '@mui/material';

interface Dashboard {
    url: string | null,
    views: {
        title: string,
        visibility: string[]
    }[]
}

const Config: () => JSX.Element = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const getPanels = async () => {
        const rawPanels = await fetchLovelacePanels();
        const lovelacePanels: (string | null)[] = [null];
        for (const rawPanelName in rawPanels) {
            const rawPanel = rawPanels[rawPanelName];
            if (rawPanel.component_name != 'lovelace') {
                continue;
            }
            if (rawPanel.url_path == 'lovelace' || rawPanel.url_path == 'map') {
                continue;
            }
            lovelacePanels.push(rawPanel.url_path);
        }
        const users = (await fetchAuthList()).filter(user => !user.system_generated).sort((u1, u2) => (u1.username??'') < (u2.username??'') ? -1 : 1);
        const allUserIds = users.map(user => user.id);
        const dashboards = await Promise.all<Dashboard>(lovelacePanels.map((urlPath: string | null) => new Promise((resolve, reject) => {
            fetchLovelaceDashBoard(urlPath).then((result) => {
                resolve({
                    url: urlPath,
                    views: result.views.map(view => {
                        return {
                            title: view.title,
                            visibility: view.visible === undefined ? allUserIds : view.visible.map(value => value.user),
                        };
                    }),
                });
            });
        })));
        setUsers(users);
        setSelectedUsers(users.map(user=>user.id));
        setDashboards(dashboards);
    };

    useEffect(() => {
        getPanels();
    }, []);

    if (dashboards.length===0) {
        return <Box>Loading</Box>;
    }

    return (
        <Box>
            {/*{users?.map(user=><Box><Checkbox*/}
            {/*    checked={selectedUsers.includes(user.id)}*/}
            {/*    onChange={()=>{*/}
            {/*        if(selectedUsers.includes(user.id)){*/}
            {/*            setSelectedUsers(selectedUsers.filter((u)=>user.id!==u));*/}
            {/*           return;*/}
            {/*        }*/}
            {/*        selectedUsers.push(user.id);*/}
            {/*        setSelectedUsers(selectedUsers.map(user=>user));*/}
            {/*    }}*/}
            {/*>{user.username}</Checkbox>{user.name}</Box>)}*/}
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {users?.filter(user=>selectedUsers.includes(user.id)).map(user=><TableCell align="center">{user.username}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dashboards.map(dashboard => <>
                            <TableRow>
                                <TableCell><Typography fontWeight={"bold"}>{dashboard.url ?? 'default'}</Typography></TableCell>
                                <TableCell colSpan={users?.length}>&nbsp;</TableCell>
                            </TableRow>
                            {dashboard.views.map(view=> <TableRow>
                                <TableCell>- {view.title}</TableCell>
                                {users?.filter(user=>selectedUsers.includes(user.id)).map(user=><TableCell align="center">{view.visibility.includes(user.id)?'X':'-'}</TableCell>)}
                            </TableRow>)}
                        </>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Config;
