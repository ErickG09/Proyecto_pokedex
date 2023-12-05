import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Card, CardContent, Typography, Chip, Button, Grid, Box } from '@mui/material';

const tipoColor = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  }

export const PokemonDetalles = ({ pokemonId, onClose }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!pokemonId) return;

    const getDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const detailsData = response.data;
        
        const pokemonDetails = {
          id: detailsData.id,
          name: detailsData.name,
          image: detailsData.sprites.other['official-artwork'].front_default,
          types: detailsData.types.map((typeInfo) => typeInfo.type.name),
          stats: detailsData.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat
          })),
        };

        setDetails(pokemonDetails);
      } catch (error) {
        console.error('Hubo un error al obtener los detalles del Pokémon:', error);
      }
    };

    getDetails();
  }, [pokemonId]);

  if (!details) {
    return <div>Cargando...</div>; 
  }

  return (
    <Modal open={!!pokemonId} onClose={onClose}>
      <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, p: 4 }}>
        <CardContent>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Box component="img" src={details.image} alt={details.name} sx={{ width: 200 }} />
            </Grid>
            <Grid item>
              <Typography variant="h4">{details.name.charAt(0).toUpperCase() + details.name.slice(1)}</Typography>
              <Typography variant="subtitle1">No. {details.id}</Typography>
            </Grid>
            <Grid item>
              <Box>
                {details.types.map((tipo) => (
                  <Chip key={tipo} label={tipo.toUpperCase()} sx={{ backgroundColor: tipoColor[tipo], color: 'white', margin: '4px' }} />
                ))}
              </Box>
            </Grid>
            <Grid item>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {details.stats.map(stat => (
                  <li key={stat.name}>
                    <Typography variant="body1">{stat.name}: {stat.value}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={onClose}>Cerrar</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Modal>
  );
};

