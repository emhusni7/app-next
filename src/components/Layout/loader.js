import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }} >
      <CircularProgress  variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export function CircularStatic() {
  const [progress, setProgress] = React.useState(25);

  React.useEffect(() => {
   
    const timer = setInterval(() => {
      setProgress((prevProgress) => 
      (prevProgress >= 100 ? 0 : prevProgress + 25));
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (<Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    >
      <Grid item md={12} m={2} pt={5} alignItems="center" >
        <CircularProgressWithLabel  size="15rem" value={progress} />
        </Grid>
      </Grid>);

}

export function CustomizedProgressBars() {
  const [progress, setProgress] = React.useState(25);
  React.useEffect(() => {
   
    const timer = setInterval(() => {
      setProgress((prevProgress) => 
      (prevProgress >= 100 ? 0 : prevProgress + 25));
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box>
      <BorderLinearProgress variant="determinate" value={progress} />
    </Box>
  );
}