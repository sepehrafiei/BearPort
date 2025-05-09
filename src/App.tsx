import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Dashboard from './pages/Dashboard/Dashboard';
import Wrapper from './pages/Wrapper/Wrapper';
import DashboardProfile from './pages/Dashboard/Profile/Profile';
import PublicProfile from './pages/Profile/Profile';
import Messages from './pages/Dashboard/Messages/Messages';
import Donation from './pages/Dashboard/Donation/Donation';
import Rides from './pages/Dashboard/Rides/Rides';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/dashboard/*" element={
          <Wrapper>
            <Dashboard />
          </Wrapper>
        }>
          <Route index element={<DashboardProfile />} />
          <Route path="rides" element={<Rides />} />
          <Route path="messages" element={<Messages />}/>
          <Route path="donation" element={<Donation />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;