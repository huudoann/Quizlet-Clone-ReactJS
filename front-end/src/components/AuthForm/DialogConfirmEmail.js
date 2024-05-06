import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DialogConfirmEmail = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Xác nhận Email</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Vui lòng kiểm tra hộp thư đến của bạn và xác nhận địa chỉ email để hoàn tất quá trình đăng ký.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogConfirmEmail;