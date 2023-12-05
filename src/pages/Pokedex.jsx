import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, arrayUnion, updateDoc} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { Button, Grid } from '@mui/material';

import { Pokemon } from '../components/Pokemon';
import { auth, dbStorage } from '../firebase/firebase-config';

import { PokemonDetalles } from '../components/PokemonDetalles';

export const Pokedex = () => {
  const [pokemones, setPokemones] = useState([]);
  const [page, setPage] = useState(1);
  const [equipo, setEquipo] = useState([]);
  const [currentUID, setCurrentUID] = useState('');
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);


  const url = `https://pokeapi.co/api/v2/pokemon/?limit=9&offset=${
    (page - 1) * 9
  }`;
  useEffect(() => {
    if (currentUID) {
      obtenerEquipo(currentUID).then(pokemonIds => {
        if (pokemonIds) {
          setEquipo(pokemonIds);
        }
      });
    } else {
      setEquipo([]);
    }
  }, [currentUID]);

  const obtenerEquipo = async (uid) => {
    const equipoRef = doc(dbStorage, 'users', uid); // Use the UID to reference the correct document
    const docSnap = await getDoc(equipoRef);

    if (docSnap.exists()) {
      const pokemonIds = docSnap.data().pokemons;

      return pokemonIds;
      
    } else {
      console.log('No hay equipo para este usuario');
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUID(user.uid);
        obtenerEquipo(user.uid).then(pokemonIds => {
          if (pokemonIds) {
            setEquipo(pokemonIds); 
          }
        });
      } else {
        setCurrentUID('');
        setEquipo([]); 
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    // Fetching Pokémon data
    axios
      .get(url)
      .then((response) => {
        setPokemones(response.data.results);
        const pokemonList = response.data.results;
        const pokemonPromises = pokemonList.map((pokemon) =>
          axios.get(pokemon.url)
        );

        Promise.all(pokemonPromises).then((pokemonResponses) => {
          const pokemonData = pokemonResponses.map((res) => {
            const pokemon = res.data;
            return {
              id: pokemon.id,
              name: pokemon.name,
              image: pokemon.sprites.other['official-artwork'].front_default,
              types: pokemon.types.map((typeInfo) => typeInfo.type.name)
            };
          });
          setPokemones(pokemonData);
        });
      })
      .catch((error) => console.error('Error fetching Pokemon data:', error));
  }, [page, url]);

  const agregarPokemon = (pokemon) => {
    console.log('Adding Pokémon:', pokemon); // Check the pokemon object
  
    if (auth.currentUser && auth.currentUser.uid) {
      if (equipo.length < 6 && !equipo.includes(pokemon.id)) {
        if (pokemon.id === undefined) {
          console.error('Trying to add a Pokémon with undefined ID');
          return;
        }
  
        const newEquipo = [...equipo, pokemon];
        setEquipo(newEquipo);
        actualizarFirebase(currentUID, newEquipo); // Passing uid
      } else {
        console.log('El equipo está completo o el Pokémon ya está en el equipo');
      }
    } else {
      console.log('Usuario no autenticado');
    }
  };
  
  
  const eliminarPokemon = (pokemonId) => {
    if (auth.currentUser && auth.currentUser.uid) {
      const equipoActualizado = equipo.filter((id) => id !== pokemonId);
      setEquipo(equipoActualizado);
      actualizarFirebase(currentUID, equipoActualizado); // Passing uid
    }
  };
  
  const actualizarFirebase = async (uid, equipoActualizado) => {
    console.log('Data before processing:', equipoActualizado);
  
    // Assuming equipoActualizado is an array of objects with an 'id' property
    const pokemonsId = equipoActualizado.map((p) => p.id);
  
    // Additional check to filter out any undefined IDs
    const filteredPokemonsId = pokemonsId.filter(id => id !== undefined);
  
    console.log('Pokémon IDs to update:', filteredPokemonsId);
    console.log('Updating Firebase for UID:', uid);
  
    if (uid && filteredPokemonsId.length > 0) {
      const userTeamRef = doc(dbStorage, 'users', uid);
  
      try {
        await updateDoc(userTeamRef, {
          pokemons: arrayUnion(...filteredPokemonsId)
        });
        console.log('Equipo actualizado en Firebase');
      } catch (error) {
        console.error('Error al actualizar el equipo en Firebase:', error);
      }
    } else {
      console.log('No UID present or no valid Pokémon IDs, unable to update Firebase');
    }
  };
  
  const handlePokemonClick = (pokemonId) => {
    setSelectedPokemonId(pokemonId);
  };

  const handleCloseDetails = () => {
    setSelectedPokemonId(null);
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          maxHeight: '53rem',
          margin: 'auto',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '10px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(57, 167, 255, 0.7)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(255, 238, 217)',
            borderRadius: '4px'
          }
        }}
      >
        {pokemones.map((pokemon) => {
          return (
            <Grid
              item
              // key={pokemon.id}
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
              <div key={pokemon.id} onClick={() => handlePokemonClick(pokemon.id)}>
                <Pokemon
                    pokemon={pokemon}
                    agregar={() => agregarPokemon(pokemon)}
                    quitar={() => eliminarPokemon(pokemon)}
                    flag={equipo.some((p) => p.id === pokemon.id)}
                />
              </div>
            </Grid>
          );
        })}
      </Grid>
      <Grid
        container
        gap={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Grid item>
          {page != 1 && (
            <Button
              variant="contained"
              sx={{
                minWidth: '7rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgb(80, 196, 255)',
                marginTop: '5px',
                color: 'black',
                fontWeight: 'bold', 
                '&:hover': {
                  backgroundColor: 'rgb(255, 238, 217)'
                }
              }}
              className="cambiar-boton"
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            fullWidth
            sx={{
              minWidth: '7rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgb(80, 196, 255)',
              marginTop: '5px',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgb(255, 238, 217)'
              }
            }}
            onClick={() => setPage(page + 1)}
          >
            Después
          </Button>
        </Grid>
      </Grid>

      {selectedPokemonId && (
        <PokemonDetalles pokemonId={selectedPokemonId} onClose={handleCloseDetails} />
      )}
    </>
  );
};
