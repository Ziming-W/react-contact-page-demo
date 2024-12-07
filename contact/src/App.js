import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Tooltip, TablePagination, TextField, Button
} from '@mui/material';
import Popover from '@mui/material/Popover';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  /**
   * Fetch users data from API
   */
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => console.error('Error fetching users:', err));

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check screen size on initial render

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePopoverOpen = (event, content) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  const open = Boolean(anchorEl); // represents if the popover is open

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /***
   * search among all fields except geo coordinates if user inputs anything
   */
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query) ||
      user.website.toLowerCase().includes(query) ||
      user.address.street.toLowerCase().includes(query) ||
      user.address.suite.toLowerCase().includes(query) ||
      user.address.city.toLowerCase().includes(query) ||
      user.address.zipcode.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query) ||
      user.company.catchPhrase.toLowerCase().includes(query) ||
      user.company.bs.toLowerCase().includes(query)
    ));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredUsers(users);
    setPage(0);
  };

  const isFieldMatched = (value, query) => {
    if (!query) return false;
    return value && value.toLowerCase().includes(query.toLowerCase());
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  /***
   * card view for mobile devices
   */
  const renderCardView = () => (
    <div className="card-container">
      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
        <div key={user.id} className="card">
          <Typography variant="h6" className={`card-header ${isFieldMatched(user.name, searchQuery) ? 'highlighted' : ''}`}>{user.name}</Typography>
          <div className="card-content">
            <div className={`card-row ${isFieldMatched(String(user.id), searchQuery) ? 'highlighted' : ''}`}><strong>ID:</strong> {user.id}</div>
            <div className={`card-row ${isFieldMatched(user.username, searchQuery) ? 'highlighted' : ''}`}>
              <strong>Username:</strong> {user.username}
            </div>
            <div className={`card-row ${isFieldMatched(user.email, searchQuery) ? 'highlighted' : ''}`}>
              <strong>Email:</strong> {user.email}
            </div>
            <div className={`card-row ${isFieldMatched(user.phone, searchQuery) ? 'highlighted' : ''}`}>
              <strong>Phone:</strong> {user.phone}
            </div>
            <div className={`card-row ${isFieldMatched(user.website, searchQuery) ? 'highlighted' : ''}`}>
              <strong>Website:</strong> <a href={`http://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a>
            </div>
            <div className={`card-row ${isFieldMatched(`${user.address.suite} ${user.address.street} ${user.address.city} ${user.address.zipcode}`, searchQuery)
              ? 'highlighted'
              : ''
              }`}>
              <strong>Address:</strong> <span className="clickable expanded-address" onClick={(e) =>
                handlePopoverOpen(e, (
                  <div className="popover-content">
                    <Typography variant="h6" className="popover-heading">Full Address</Typography>
                    <div><strong>Street:</strong> {user.address.street}</div>
                    <div><strong>Suite:</strong> {user.address.suite}</div>
                    <div><strong>City:</strong> {user.address.city}</div>
                    <div><strong>Zipcode:</strong> {user.address.zipcode}</div>
                    <div><strong>Lat:</strong> {user.address.geo.lat}</div>
                    <div><strong>Lng:</strong> {user.address.geo.lng}</div>
                  </div>
                ))
              }>{user.address.suite}, {user.address.street}, {user.address.city} {user.address.zipcode}</span>
            </div>
            <div className={`card-row ${isFieldMatched(`${user.company.name} ${user.company.catchPhrase} ${user.company.bs}`, searchQuery)
              ? 'highlighted'
              : ''
              }`}>
              <strong>Company:</strong> <span className="clickable" onClick={(e) =>
                handlePopoverOpen(e, (
                  <div className="popover-content">
                    <Typography variant="h6" className="popover-heading">Company Info</Typography>
                    <div><strong>Name:</strong> {user.company.name}</div>
                    <div><strong>Catchphrase:</strong> {user.company.catchPhrase}</div>
                    <div><strong>BS:</strong> {user.company.bs}</div>
                  </div>
                ))
              }>{user.company.name}</span>
            </div>
          </div>
        </div>
      ))}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </div>
  );

  /**
   * table view for desktop devices
   */
  const renderTableView = () => (
    <TableContainer component={Paper} className="table-container">
      <Table aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '5%' }} className="table-header">ID</TableCell>
            <TableCell style={{ width: '10%' }} className="table-header">Name</TableCell>
            <TableCell style={{ width: '10%' }} className="table-header">Username</TableCell>
            <TableCell style={{ width: '15%' }} className="table-header">Email</TableCell>
            <TableCell style={{ width: '10%' }} className="table-header">Phone</TableCell>
            <TableCell style={{ width: '10%' }} className="table-header">Website</TableCell>
            <TableCell style={{ width: '30%' }} className="table-header">Address</TableCell>
            <TableCell style={{ width: '10%' }} className="table-header">Company</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
            const { address, company } = user;
            return (
              <TableRow key={user.id}>
                <TableCell className={`table-cell ${isFieldMatched(String(user.id), searchQuery) ? 'highlighted' : ''}`}>
                  <Tooltip title={user.id} arrow>
                    <span>{user.id}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(user.name, searchQuery) ? 'highlighted' : ''}`}>
                  <Tooltip title={user.name} arrow>
                    <span>{truncateText(user.name, 20)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(user.username, searchQuery) ? 'highlighted' : ''}`}>
                  <Tooltip title={user.username} arrow>
                    <span>{truncateText(user.username, 20)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(user.email, searchQuery) ? 'highlighted' : ''}`}>
                  <Tooltip title={user.email} arrow>
                    <span>{truncateText(user.email, 25)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(user.phone, searchQuery) ? 'highlighted' : ''}`}>
                  <Tooltip title={user.phone} arrow>
                    <span>{truncateText(user.phone, 20)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(user.website, searchQuery) ? 'highlighted' : ''}`}>
                  <a href={`http://${user.website}`} target="_blank" rel="noreferrer">
                    {user.website}
                  </a>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(
                  `${address.suite} ${address.street} ${address.city} ${address.zipcode}`,
                  searchQuery
                ) ? 'highlighted' : ''
                  }`}>
                  <Tooltip title="Click to see full address">
                    <Typography
                      variant="body2"
                      className="clickable"
                      onClick={(e) =>
                        handlePopoverOpen(e, (
                          <div className="popover-content">
                            <Typography variant="h6" className="popover-heading">Full Address</Typography>
                            <div><strong>Street:</strong> {address.street}</div>
                            <div><strong>Suite:</strong> {address.suite}</div>
                            <div><strong>City:</strong> {address.city}</div>
                            <div><strong>Zipcode:</strong> {address.zipcode}</div>
                            <div><strong>Lat:</strong> {address.geo.lat}</div>
                            <div><strong>Lng:</strong> {address.geo.lng}</div>
                          </div>
                        ))
                      }
                    >
                      {address.suite}, {address.street}, {address.city}, {address.zipcode}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell className={`table-cell ${isFieldMatched(
                  `${company.name} ${company.catchPhrase} ${company.bs}`,
                  searchQuery
                ) ? 'highlighted' : ''
                  }`}>
                  <Tooltip title="Click to see full company info">
                    <Typography
                      variant="body2"
                      className="clickable"
                      onClick={(e) =>
                        handlePopoverOpen(e, (
                          <div className="popover-content">
                            <Typography variant="h6" className="popover-heading">Company Info</Typography>
                            <div><strong>Name:</strong> {company.name}</div>
                            <div><strong>Catchphrase:</strong> {company.catchPhrase}</div>
                            <div><strong>BS:</strong> {company.bs}</div>
                          </div>
                        ))
                      }
                    >
                      {company.name}</Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </TableContainer>
  );

  return (
    <div className="contact-page">
      <Typography variant="h4" gutterBottom className="header">
        CONTACT
      </Typography>
      <div className='search-container'>
        <TextField label="Search" variant="outlined" fullWidth value={searchQuery} onChange={handleSearchChange} className='search-input' />
        {searchQuery && (
          <Button variant="contained" color="secondary" onClick={handleClearSearch} style={{ height: '55px' }}>
            Clear
          </Button>
        )}
      </div>
      {isMobile ? (
        renderCardView()
      ) : (
        renderTableView()
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        classes={{ paper: 'popover-rounded popover-font' }}
        style={{ borderRadius: '16px' }}
      >
        {popoverContent}
      </Popover>

    </div>
  );
}

export default App;
