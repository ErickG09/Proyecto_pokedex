import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { Button, Container, Grid } from '@mui/material';

import { auth, dbStorage } from '../firebase/firebase-config';
import { Pokemon } from './Pokemon';

export const Equipo = () => {
  const [equipo, setEquipo] = useState([]);
  const [currentUID, setCurrentUID] = useState('');

  useEffect(() => {
    // Authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUID(user.uid);
        obtenerEquipo(user.uid); // Call obtenerEquipo here with the current UID
      } else {
        setCurrentUID('');
        setEquipo([]); // Clear equipo if no user is logged in
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para obtener los datos del equipo desde Firebase
  const obtenerEquipo = async (uid) => {
    const equipoRef = doc(dbStorage, 'users', uid); // Use the UID to reference the correct document
    const docSnap = await getDoc(equipoRef);

    if (docSnap.exists()) {
      const pokemonIds = docSnap.data().pokemons;
      const pokemonPromises = pokemonIds.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()
        )
      );

      Promise.all(pokemonPromises).then((pokemonData) => {
        setEquipo(
          pokemonData.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default,
            types: pokemon.types.map((typeInfo) => typeInfo.type.name),
            number: pokemon.order
          }))
        );
      });
    } else {
      console.log('No hay equipo para este usuario');
    }
  };

  const eliminarPokemon = (pokemonId) => {
    if (auth.currentUser && auth.currentUser.uid) {
      const equipoActualizado = equipo.filter((id) => id !== pokemonId);
      setEquipo(equipoActualizado);
      actualizarFirebase(currentUID, equipoActualizado); // Passing uid
    }
  };
  

  const actualizarFirebase = (uid, equipoActualizado) => {
    console.log('Data before processing:', equipoActualizado);
  
    // Assuming equipoActualizado is an array of objects with an 'id' property
    const pokemonsId = equipoActualizado.map((p) => p.id);
  
    // Additional check to filter out any undefined IDs
    const filteredPokemonsId = pokemonsId.filter(id => id !== undefined);
  
    console.log('Pokémon IDs to update:', filteredPokemonsId);
    console.log('Updating Firebase for UID:', uid);
  
    if (uid && filteredPokemonsId.length > 0) {
      const userTeamRef = doc(dbStorage, 'users', uid);
  
      setDoc(userTeamRef, { uid, pokemons: filteredPokemonsId })
        .then(() => console.log('Equipo actualizado en Firebase'))
        .catch((error) =>
          console.error('Error al actualizar el equipo en Firebase:', error)
        );
    } else {
      console.log('No UID present or no valid Pokémon IDs, unable to update Firebase');
    }
  };
  
  return (
    <Container
      sx={{
        maxWidth: '70%',
        margin: 'auto',
        marginTop: '1rem',
        justifyContent: 'center'
      }}
    >
      <Grid container spacing={1} sx={{ minHeight: '55rem', margin: 'auto' }}>
        {equipo.map((pokemon) => (
          <Grid
            item
            key={pokemon.id}
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
              marginBottom: '1rem'
            }}
          >
            <Pokemon
              key={pokemon.id}
              pokemon={pokemon}
              quitar={() => eliminarPokemon(pokemon)}
              flag={equipo.some((p) => p.id === pokemon.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default Equipo;
