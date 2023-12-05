import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Card, CardMedia, CardContent, Typography, Chip, Button, Box, LinearProgress, Stack } from '@mui/material';

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

  const maxStatValue = Math.max(...details.stats.map(stat => stat.value));

  return (
    <Modal
      open={!!pokemonId}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card sx={{
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 5,
        p: 4,
        borderRadius: 2,
        position: 'relative',
        outline: 'none',
      }}>
        <CardMedia
          component="img"
          height="240"
          image={details.image}
          alt={details.name}
          sx={{ objectFit: 'contain', background: '#f0f0f0', borderRadius: 2 }}
        />
        <CardContent sx={{ textAlign: 'center', pt: 2 }}>
          <Typography gutterBottom variant="h5" component="div">
            {details.name.charAt(0).toUpperCase() + details.name.slice(1)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            No. {details.id}
          </Typography>
          <Box sx={{ my: 2 }}>
            {details.types.map((tipo) => (
              <Chip
                key={tipo}
                label={tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: tipoColor[tipo],
                  color: 'common.white',
                  fontSize: '0.875rem',
                }}
              />
            ))}
          </Box>
          <Stack spacing={1} sx={{ width: '100%', my: 2 }}>
            {details.stats.map(stat => (
              <Box key={stat.name}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {stat.name.charAt(0).toUpperCase() + stat.name.slice(1).replace('-', ' ')}
                  <span>{stat.value}</span>
                </Typography>
                <LinearProgress variant="determinate" value={(stat.value / maxStatValue) * 100} />
              </Box>
            ))}
          </Stack>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button variant="contained" color="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

