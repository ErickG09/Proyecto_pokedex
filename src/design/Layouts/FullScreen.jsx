import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import logoPika from '../../assets/images/pikachu.png';
import { auth } from '../../firebase/firebase-config';

const FullScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ minHeight: '7rem', background: 'rgba(57, 167, 255, 0.7)' }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box
              gap={1}
              display="flex"
              alignItems="center"
              onClick={() => {
                navigate('/');
              }}
              sx={{ cursor: 'pointer', maxWidth: '10rem', marginTop: '0.5rem' }}
            >
              <img width="100" height="100" src={logoPika} alt="Pokedex" />
              <Typography
                fontStyle="italic"
                fontWeight={700}
                fontSize="2rem"
                pt={1}
              >
                Pokedex
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {user ? (
                <>
                  {' '}
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ marginLeft: 'auto', minWidth: '10rem' }}
                    onClick={() => {
                      logout();
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                  <Button
                    color="inherit"
                    onClick={async () => {
                      navigate('/team');
                    }}
                  >
                    Equipo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ marginLeft: 'auto', minWidth: '10rem' }}
                    onClick={() => navigate('/login')}
                  >
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          pt: '7.5rem',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          background: 'rgba(57, 167, 255, 0.5)',
          boxSizing: 'border-box' // Ensures padding and border are included in total width/height
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default FullScreen;
