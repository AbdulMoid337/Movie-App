import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;