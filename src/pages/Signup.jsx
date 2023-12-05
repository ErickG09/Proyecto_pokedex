import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  TextField,
  Typography
} from '@mui/material';

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Usuario es requerido'),
    lastName: Yup.string().required('Usuario es requerido'),
    email: Yup.string()
      .required('Usuario es requerido')
      .min(7, 'Usuario incorrecto'),
    password: Yup.string().required('Contraseña requerida').min(4, '4')
  });

  const handleSubmit = async () => {
    const signup = await dispatch(userSignUp(values));
    if (signup.meta.requestStatus === 'fulfilled') navigate(RoutesEnum.LOGIN);
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        width: '35.375rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          margin: 'auto',
          padding: '3.6875rem',
          borderRadius: '1.5rem'
        }}
      >
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          }}
          onSubmit={(values) => handleSubmit(values)}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form>
              <Box
                sx={{
                  height: '85vh',
                  maxHeight: '46.9375rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography fontSize="1.75rem" fontWeight={500} mb="1rem">
                    Create your account
                  </Typography>
                  <Typography fontSize="1.25rem" fontWeight={500} mb="3rem">
                    Subtitle subtitle of subtitle subt.
                  </Typography>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
export default SignupPage;
