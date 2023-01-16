import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import type { User } from '../../../types/user';
import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';
import { SeverityPill } from '../../severity-pill';

interface UserListTableProps {
    users: User[];
    usersCount: number;
    onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    rowcallback: (rowId: string) => void;
    page: number;
    rowsPerPage: number;
}

export const UserListTable = (props: UserListTableProps): JSX.Element => {
    const {
        users,
        usersCount,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        rowcallback,
        ...other
    } = props;
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Reset selected users when users change
    useEffect(
        () => {
            if (selectedUsers.length) {
                setSelectedUsers([]);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [users]
    );

    const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedUsers(
            event.target.checked
                ? users.map((user) => user.id)
                : []
        );
    };

    const handleSelectOneUser = (
        event: ChangeEvent<HTMLInputElement>,
        userId: string
    ): void => {
        if (!selectedUsers.includes(userId)) {
            setSelectedUsers((prevSelected) => [...prevSelected, userId]);
        } else {
            setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId));
        }
    };

    const enableBulkActions = selectedUsers.length > 0;
    const selectedSomeUsers = selectedUsers.length > 0
        && selectedUsers.length < users.length;
    const selectedAllUsers = selectedUsers.length === users.length;

    return (
        <div {...other}>
            <Box
                sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.100',
                    display: enableBulkActions ? 'block' : 'none',
                    px: 2,
                    py: 0.5
                }}
            >
                <Checkbox
                    checked={selectedAllUsers}
                    indeterminate={selectedSomeUsers}
                    onChange={handleSelectAllUsers}
                />
                <Button
                    size="small"
                    sx={{ ml: 2 }}
                >
                    Delete
                </Button>
                <Button
                    size="small"
                    sx={{ ml: 2 }}
                >
                    Edit
                </Button>
            </Box>
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ visibility: enableBulkActions ? 'collapse' : 'visible' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllUsers}
                                    indeterminate={selectedSomeUsers}
                                    onChange={handleSelectAllUsers}
                                />
                            </TableCell>
                            <TableCell>
                                USERS
                            </TableCell>
                            <TableCell>
                                ROLE
                            </TableCell>
                            <TableCell>
                                EMAIL
                            </TableCell>
                            <TableCell align="center">
                                EXTENTION
                            </TableCell>
                            <TableCell>
                                STATUS
                            </TableCell>
                            <TableCell align="right">
                                ACTION
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            if(user && user.id) {
                                const isUserSelected = selectedUsers.includes(user.id);
    
                                return (
                                    user && user.id && <TableRow
                                        hover
                                        key={user.id}
                                        selected={isUserSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isUserSelected}
                                                onChange={(event) => handleSelectOneUser(
                                                    event,
                                                    user.id
                                                )}
                                                value={isUserSelected}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Avatar
                                                    src={user.avatar}
                                                    sx={{
                                                        height: 42,
                                                        width: 42
                                                    }}
                                                >
                                                    {getInitials(user.firstname + " " + user.lastname)}
                                                </Avatar>
                                                <Box sx={{ ml: 1 }}>
                                                    <Link
                                                        color="inherit"
                                                        variant="subtitle2"
                                                        onClick={(event: any) => rowcallback(user.id)}
                                                    >
                                                        {user.firstname + ' ' + user.lastname}
                                                    </Link>
                                                    <Typography
                                                        color="textSecondary"
                                                        variant="body2"
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {user.role}
                                        </TableCell>
                                        <TableCell>
                                            {user.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography>
                                                {201}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {user.status === 'active' &&
                                                    <SeverityPill color={'success'}>
                                                        {'Active'}
                                                    </SeverityPill>
                                                }
                                                {user.status !== 'active' &&
                                                    <SeverityPill color={'error'}>
                                                        {'Inactive'}
                                                    </SeverityPill>
                                                }
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton component="a" onClick={(event: any) => rowcallback(user.id)}>
                                                <PencilAltIcon fontSize="small" />
                                            </IconButton>
    
                                            <IconButton component="a" onClick={(event: any) => rowcallback(user.id)}>
                                                <ArrowRightIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            } else {
                                return <></>
                            }
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={usersCount}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
};

UserListTable.propTypes = {
    users: PropTypes.array.isRequired,
    usersCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
