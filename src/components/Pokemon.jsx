import { Box, Button, Typography, useTheme } from '@mui/material';

import { PokemonTypeColors } from '../enum/pokemonType';

const useStyles = (theme) => ({
  pokemonCard: {
    width: 300,
    height: 350,
    maxWidth: 400,
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-5px)',
      transition: 'transform 0.3s'
    }
  },
  pokemonId: {
    color: '#666',
    fontSize: '1.25em',
    textAlign: 'center'
  },
  pokemonImageContainer: {
    width: '12rem',
    height: 'auto',
    margin: 'auto'
  },
  pokemonTypeContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    span: {
      padding: '0.2rem 0.6rem',
      borderRadius: '10px',
      marginRight: '5px',
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 'bold',
      textTransform: 'capitalize'
    }
  },
  actionButton: {
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    marginTop: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
    '&.agregar': {
      backgroundColor: '#4CAF50',
      color: 'white',
      '&:hover': {
        backgroundColor: '#45a049'
      }
    },
    '&.remover': {
      backgroundColor: '#f44336',
      color: 'white',
      '&:hover': {
        backgroundColor: '#d32f2f'
      }
    }
  }
});

export const Pokemon = ({ pokemon, agregar, quitar, flag}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  if (!pokemon.types) {
    return null;
  }

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };


  return (
    <div>
      <Box sx={styles.pokemonCard} >
      <Typography sx={styles.pokemonId}>No. {pokemon.id}</Typography>
      <Box sx={styles.pokemonImageContainer}>
        <img width="100%" src={pokemon.image} alt={pokemon.name} />
      </Box>
      <Box sx={{ padding: '0', textAlign: 'center' }}>
        <Typography sx={{ color: '#333', margin: 0 }}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Typography>
        <Box sx={styles.pokemonTypeContainer}>
          {pokemon.types.map((tipo) => (
            <span
              key={tipo}
              style={{
                backgroundColor: PokemonTypeColors[tipo],
                color: '#fff'
              }}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </span>
          ))}
        </Box>
        <Box>
          {agregar && !flag && (
            <Button
              className="agregar"
              sx={styles.actionButton}
              onClick={(e) => handleButtonClick(e, () => agregar(pokemon))}
            >
              Agregar
            </Button>
          )}
          {quitar && flag && (
            <Button
              className="remover"
              sx={styles.actionButton}
              onClick={(e) => handleButtonClick(e, () => quitar(pokemon))}
            >
              Quitar
            </Button>
          )}
        </Box>
      </Box>
    </Box>
    </div>
    
  );
};
