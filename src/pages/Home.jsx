import { Container } from '@mui/material';

import { Pokedex } from './Pokedex';

export const Home = () => {
  return (
    <Container
      sx={{
        maxWidth: '70%',
        margin: 'auto',
        marginTop: '1rem',
        justifyContent: 'center'
      }}
    >
      <Pokedex />
    </Container>
  );
};

export default Home;
