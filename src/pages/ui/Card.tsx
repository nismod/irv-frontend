import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export const Card = ({ title, href, image, text }) => (
  <MuiCard
    className="card"
    variant="outlined"
    square
    sx={{
      width: 300,
      minHeight: 450,
    }}
  >
    <CardActionArea>
      <Link
        to={href}
        style={{
          textDecoration: 'none',
        }}
      >
        <Typography variant="h2" sx={{ color: '#222', p: 2, m: 0 }}>
          {title}
        </Typography>
        <img src={image} alt={title} width="100%" height="auto" style={{ display: 'block' }} />
        <Box height={165} sx={{ overflow: 'hidden' }}>
          <Typography
            variant="body1"
            sx={{
              color: '#222',
              p: 2,
              m: 0,
            }}
          >
            {text}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#222',
              p: 2,
              m: 0,
            }}
          >
            View {title.toLowerCase()}
            <span className="icon-button-diy">
              <ArrowForward />
            </span>
          </Typography>
        </Box>
      </Link>
    </CardActionArea>
  </MuiCard>
);
