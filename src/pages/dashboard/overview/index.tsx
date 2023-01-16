import type { ChangeEvent, MouseEvent } from 'react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Switch,
  MenuItem 
} from '@mui/material';
import { customerApi } from '../../../__fake-api__/customer-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { UserListTable } from '../../../components/dashboard/overview/user-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { gtm } from '../../../lib/gtm';
import type { User } from '../../../types/user';

import { addUser, getUsers } from 'src/slices/user';

import { UserEdit} from './component/edit';



type SortField = 'updatedAt' | 'totalOrders';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'updatedAt|desc'
  | 'updatedAt|asc'
  | 'totalOrders|desc'
  | 'totalOrders|asc';

interface SortOption {
  label: string;
  value: Sort;
}

type TabValue = 'all' | 'active' | 'inActive';

interface Tab {
  label: string;
  value: TabValue;
}

const tabs: Tab[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Passive',
    value: 'inActive'
  }
];

const sortOptions: SortOption[] = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  }
];


const UserList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  //const [users, setUsers] = useState<User[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User|undefined>();

  const [file, setFile] = useState<File>();

  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<string>("");

  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('3');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);

  const dispatch = useDispatch();

  const {users, totalCount} = useSelector((state:any)=> state.user)
  
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(
   () => {
      initial();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTab,sort, filters, page, rowsPerPage]
  );
  useEffect(
    () => {
      initial();
    },
    []
  )

  const rowCallback = (rowId:string): void=> {
    if(rowId){
      console.log('userCallback');
      const selected_user = users.filter((item:any)=> item.id === rowId)[0];
      setUser(selected_user);
      setEditOpen(true);
    } 
  }
  const initial = async() =>{
    await dispatch(getUsers(currentTab,sort,filters,{page:page,rows:rowsPerPage}));
      console.log(users)
  }

  const handleModalStatus = (event: MouseEvent<{}>): void => {
    setOpen(!open);
  }
  const handleSubmit = (event: MouseEvent<{}>): void => {
    handleModalStatus(event);
    setStatus(false);
    //
    dispatch(addUser(name, lastName, role, phone, email, password, status));
  }

  const handleEditModalStatus = (event: MouseEvent<{}>): void => {
    setEditOpen(!editOpen);
  }
  const handleEditSubmit = (event: MouseEvent<{}>): void => {
    handleModalStatus(event);
    setEditOpen(false);
    
  }
  // const handleFileChange = (event: ChangeEvent<{}>, value: File): void => {
  //   if(value)
  //     setFile(value);
  //   else
      
  // }

  const handleName = (event: ChangeEvent<HTMLInputElement>):void => {
    setName(event.target.value);
  }
  const handleLastName = (event: ChangeEvent<HTMLInputElement>):void => {
    setLastName(event.target.value);
  }
  const handleEmail = (event: ChangeEvent<HTMLInputElement>):void => {
    setEmail(event.target.value);
  }
  const handlePhone = (event: ChangeEvent<HTMLInputElement>):void => {
    setPhone(event.target.value);
  }
  const handleRole = (event: ChangeEvent<HTMLInputElement>):void => {
    setRole(event.target.value);
  }
  const handlePassword = (event: ChangeEvent<HTMLInputElement>):void => {
    setPassword(event.target.value);
  }

  const handleSwitch = (event: any):void => {
    console.log(event.target.value);
    setStatus(!status);
    //console.log(status);
  }

  const handleTabsChange = (event: ChangeEvent<{}>, value: TabValue): void => {
    console.log(value);
    setCurrentTab(value);
  };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters(queryRef.current?queryRef.current.value:"");
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };



  return (
    <>
      <Head>
        <title>
          Dashboard: User List | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Team
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  onClick={handleModalStatus}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search users"
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            {
              users && users.length>0 &&
              <UserListTable
                users={users}
                usersCount={totalCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                rowcallback={rowCallback}
                page={page}
              />
            }
          </Card>
        </Container>
        <Dialog 
          open={open} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleModalStatus} 
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Grid 
              container
              sx={{
                pt:6
              }}
            >
              <Grid item xs={5} md={5} sm={12}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    justifyContent:'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    m: -1.5,
                    p: 3
                  }}
                >
                  <Typography 
                    sx={{
                      textAlign: 'center', 
                      width:'100%',
                      mb:4
                      }} 
                    variant='h4'
                  >
                    New User
                  </Typography>
                  <Avatar 
                    //ref={imgRef}
                    alt="upload avatar" 
                    src='/static/mock-images/user.png'
                    sx={{
                      width:'10vw',
                      minWidth:100,
                      height:'10vw',
                      minHeight:100,
                    }}
                    />
                  <Box
                    sx={{
                      alignItems: 'center',
                      justifyContent:'space-around',
                      display: 'flex',
                      width:'100%',
                      mt:4
                    }}
                  >
                    <p>
                      Status
                    </p>
                    <Switch
                       defaultChecked
                      color="success"
                      onChange={handleSwitch}
                    />
                  </Box>
                </Box>
                  
              </Grid>
              <Grid item xs={7} md={7} sm={12}>
                <Typography 
                  sx={{
                    width:'100%',
                    mb:3,
                    mt:5,
                    pl:2
                    }} 
                  variant='h6'
                >
                  Personal Info
                </Typography>
                <Divider/>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Name</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      fullWidth
                      onChange={handleName}
                    />
                  </Grid>
                </Grid>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Last Name</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="lastName"
                      label="Last Name"
                      type="text"
                      fullWidth
                      onChange={handleLastName}
                    />
                  </Grid>
                </Grid>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Role</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      margin="dense"
                      select
                      id="roldId"
                      label="Role"
                      type="text"
                      fullWidth
                      onChange={handleRole}
                    >
                      <MenuItem value='1'>
                        {"Admin"}
                      </MenuItem>
                      <MenuItem value='2'>
                        {"User"}
                      </MenuItem>
                      <MenuItem value='3'>
                        {"Dispatcher"}
                      </MenuItem>
                      
                    </TextField>
                  </Grid>
                </Grid>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Phone</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      
                      margin="dense"
                      id="phone"
                      label="Phone"
                      type="text"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      fullWidth
                      onChange={handlePhone}
                    />
                  </Grid>
                </Grid>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Email</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      onChange = {handleEmail}
                    />
                  </Grid>
                </Grid>
                <Grid 
                  container
                  sx={{
                    pr:3,
                    pl:2,
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                  }}
                >
                  <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Password</p>
                  </Grid>
                  <Grid item xs={7} md={7} sm={12}>
                    <TextField
                      
                      margin="dense"
                      id="password"
                      label="Password"
                      type="password"
                      fullWidth
                      onChange={handlePassword}
                    />
                  </Grid>
                </Grid>
                
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions 
            sx={{
              display:'flex',
              justifyContent:'center',
              mb:2  
            }}>
            <Button onClick={handleModalStatus} color="primary" variant='outlined' sx={{mr: 10}}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant='contained'>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog 
          open={editOpen} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleEditModalStatus} 
          aria-labelledby="form-dialog-title"
        >
          <UserEdit user={user}/>
        </Dialog>
      </Box>
    </>
  );
};

UserList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default UserList;
