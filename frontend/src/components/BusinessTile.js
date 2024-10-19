import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const BusinessTile = ({ business }) => {
  return (
    <Card className="business-tile" variant="outlined">
      <CardContent>
        <Typography variant="h6" component="div">
          {business.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {business.category} - {business.distance} away
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BusinessTile;
