import React from 'react';
import Typography from '@mui/material/Typography';

const UserBalance = ({ balance }) => {
  return (
    <div className="user-balance">
      <Typography variant="h6" component="div">
        Your Balance: ${balance.toFixed(2)}
      </Typography>
    </div>
  );
};

export default UserBalance;
