import * as React from 'react';
import { JSX, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDialogs } from '@toolpad/core/useDialogs';
import { format } from 'date-fns'

import { deleteCode, fetchCodes, saveCode } from '../../websockets';
import { haviewaccessCode } from '../../types';
import { Switch } from '@mui/material';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { ConfirmationDialog } from '../../ConfirmationDialog';
import { formatExpiry } from '../../helpers/ExpiryFormatter';

const List: () => JSX.Element = () => {
    const dialogs = useDialogs();
    const [codes, setCodes] = useState<haviewaccessCode[]>([]);
    const navigate = useNavigate();
    const refreshCodes = () =>
        fetchCodes().then((codes) => {
            setCodes(Object.values(codes));
        });

    useEffect(() => {
        refreshCodes();
    }, []);

    const editRow = (id: string | undefined) => {
        navigate(`/codes/${id}`);
    };
    const deleteRow = async (id: string | undefined) => {
        const confirmation = await dialogs.open(ConfirmationDialog, {
            message: 'Sure to delete that code?',
        });
        if (!confirmation) {
            return;
        }
        if (id === undefined) {
            return;
        }
        await deleteCode(id);
        refreshCodes();
    };

    return (
        <React.Fragment>
            <Button onClick={() => editRow('new')}>New Code</Button>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table sx={{ minWidth: 650 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="left">Expiry</TableCell>
                            <TableCell align="left">Comment</TableCell>
                            <TableCell align="right">Enabled</TableCell>
                            <TableCell align="right">&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {codes.map((row, index) => (
                            <TableRow
                                hover
                                key={row.code_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => editRow(row.code_id)}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => editRow(row.code_id)}>
                                    {row.code}
                                </TableCell>
                                <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => editRow(row.code_id)}>
                                    {formatExpiry(''+row.expiry)}
                                </TableCell>
                                <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => editRow(row.code_id)}>
                                    {row.comment}
                                </TableCell>
                                <TableCell align="right">
                                    <Switch
                                        checked={row.enabled}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            saveCode({
                                                code_id: row.code_id!,
                                                enabled: event.target.checked,
                                            }).then(refreshCodes);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => deleteRow(row.code_id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default List;
