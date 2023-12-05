import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="pokemon-details-backdrop">
      <div className="pokemon-details">
        <img src={details.image} alt={details.name} />
        <h2>{details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h2>
        <p>No. {details.id}</p>
        <div className="pokemon-types">
        {details.types.map((tipo) => (
                      <span key={tipo} style={{ backgroundColor: tipoColor[tipo], color: '#fff' }}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </span>
                  ))}
        </div>
        <ul>
          {details.stats.map(stat => (
            <li key={stat.name}>
              {stat.name}: {stat.value}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

