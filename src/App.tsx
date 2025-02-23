import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Dashboard from './pages/Dashboard/Dashboard';
import Wrapper from './pages/Wrapper/Wrapper';
import Profile from './pages/Dashboard/Profile/Profile';
import Rooms from './pages/Dashboard/Rooms/Rooms';
import Messages from './pages/Dashboard/Messages/Messages';
import Donation from './pages/Dashboard/Donation/Donation';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/dashboard/*" element={
          <Wrapper>
            <Dashboard />
          </Wrapper>
        }>
          <Route index element={<Profile />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="messages" element={<Messages />}/>
          <Route path="donation" element={<Donation />}/>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;