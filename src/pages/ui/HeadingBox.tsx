import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeadingBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  paddingTop: '8rem',

  [theme.breakpoints.up('sm')]: {
    paddingTop: '16rem',
  },
  paddingLeft: theme.spacing(10),
  paddingRight: theme.spacing(10),
  paddingBottom: theme.spacing(2),

  borderRadius: 0,
  height: '70vh',
}));

export const HeadingBoxText = ({ children }) => {
  return (
    <Typography color={'#fff'} sx={{ fontSize: '5rem', fontWeight: 1000 }}>
      {children}
    </Typography>
  );
};

export const HeaderBlock = ({ children }) => {
  return (
    <>
      <Stack
        direction={'column-reverse'}
        height={'50vh'}
        sx={{
          backgroundColor: 'black',
          backgroundImage: `linear-gradient(to left, rgba(23,38,23, 0.8), rgba(23,38,23, 1))`,
          paddingX: '6rem',
          paddingY: '4rem',
        }}
      >
        {children}
      </Stack>
      <Stack
        sx={{
          position: 'absolute',
          top: '73vh',
          right: 25,
          // color: 'rgba(234,234,228, 0.95)',
          color: 'rgba(255,255,255, 0.95)',

          // background: 'none',
          backgroundColor: 'rgba(23,38,23, 0)',
          backgroundImage: `linear-gradient(to left, rgba(23,38,23, 0), rgba(23,38,23, 0))`,
          width: '10rem',
          height: '10rem',
          overflow: 'hidden',
          fontSize: '4rem',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          // boxShadow: '10px 5px 5px red',

          // clipPath: `polygon(10% 100%, 100% 100%, 100% 0%, 0% 0%)`,
        }}
      >
        <ExpandCircleDownIcon
          sx={{ transform: `scale(3)`, filter: 'drop-shadow(0 0 0.4rem rgba(0,0,0,0.2))' }}
        />
      </Stack>
      {/* <Stack
        sx={{
          position: 'absolute',
          top: '40vh',
          right: 0,
          color: 'white',
          backgroundColor: 'black',
          backgroundImage: `linear-gradient(to left, rgba(23,38,23, 0.8), rgba(23,38,23, 0.82))`,
          width: '20rem',
          height: '4rem',
          overflow: 'hidden',

          clipPath: `polygon(10% 100%, 100% 100%, 100% 0%, 0% 0%)`,
        }}
      >
        TEST
      </Stack> */}
    </>
  );
};
