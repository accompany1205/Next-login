import { useCallback, useEffect, useState, FC } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserEditForm } from '../../../../components/dashboard/overview/user-edit-form';
import { useMounted } from '../../../../hooks/use-mounted';
import type { User } from '../../../../types/user';
import { getInitials } from '../../../../utils/get-initials';

interface UserEditType{
  user: User|undefined,
}
export const UserEdit: FC<UserEditType> = (props) => {
  const isMounted = useMounted();
  const {user} = props;
  console.log(user);
  if (!user) {
    return null;
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(user.firstName+' ' + user.lastName)}
            </Avatar>
            
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {user.email}
              </Typography>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="subtitle2">
                  user_id:{user.id}
                </Typography>
                <Chip
                  label={user.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <UserEditForm user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

UserEdit.propTypes = {
 
};
