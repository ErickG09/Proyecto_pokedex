import { Route, Routes as RoutesFromRouter } from 'react-router-dom';

import FullScreen from '../design/Layouts/FullScreen';
import Home from '../pages/Home';
import { Equipo } from './Equipo';
import LoginSide from './LoginSide';
import SignUpSide from './SignUpSide';

const Routes = () => (
  <RoutesFromRouter>
    <Route path="/" element={<FullScreen />}>
      <Route index element={<Home />} />
      <Route path="signup" element={<SignUpSide />} />
      <Route path="login" element={<LoginSide />} />
      <Route path="team" element={<Equipo />} />
    </Route>
  </RoutesFromRouter>
);

export default Routes;
