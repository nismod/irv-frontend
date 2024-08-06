import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export const Card = ({ title, href, image, text }) => (
  <Paper
    sx={{
      width: 300,
      minHeight: 450,
    }}
  >
    <Link
      className="card"
      to={href}
      style={{
        textDecoration: 'none',
      }}
    >
      <Typography variant="h2" sx={{ color: 'white', p: 2, m: 0 }}>
        {title}
      </Typography>
      <img src={image} alt={title} width="100%" height="auto" style={{ display: 'block' }} />
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          p: 2,
          m: 0,
        }}
      >
        {text}
      </Typography>
    </Link>
  </Paper>
);
