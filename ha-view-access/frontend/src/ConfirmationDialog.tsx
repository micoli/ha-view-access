import * as React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export function ConfirmationDialog({
  payload,
  open,
  onClose,
}: DialogProps<{ message: string }, boolean>) {
  return (
    <Dialog fullWidth open={open} onClose={() => onClose(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{payload.message}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(true)}>Ok</Button>
        <Button onClick={() => onClose(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
