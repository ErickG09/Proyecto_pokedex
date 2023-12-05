import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Equipo } from './Equipo';
import Logo from './images/pikachu.png';

export const Navbar = () => {
  // useNavigate es un hook que devuelve una función para navegar entre rutas
  let navegar = useNavigate();

  return (
    <nav className="navbar-contenedor">
      <div className="navbar-sc">
        <img className="navbar-logo" src={Logo} alt="Pokemon" />
        <h1 className="navbar-titulo">Pokédex</h1>
        <div className="navbar-botones">
          <button className="navbar-boton" onClick={() => navegar('/')}>
            Inicio
          </button>
          <button className="navbar-boton" onClick={() => navegar('/Equipo')}>
            Equipo
          </button>
        </div>
        {/* <h2 className='contador'>
          {<Equipo
          />}/6</h2> */}
      </div>
    </nav>
  );
};
