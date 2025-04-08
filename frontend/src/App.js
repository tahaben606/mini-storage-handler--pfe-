import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './Context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/home';
import AddEmployee from './pages/Employees/AddEmployee';
import EditEmployee from './pages/Employees/EditEmployee';
import Equipment from './pages/Equipment';
import AddEquipment from './pages/Equipment/AddEquipment';
import EditEquipment from './pages/Equipment/EditEquipment';
import Attribution from './pages/Attribution';
import AssignEquipment from './pages/Attribution/AssignEquipment';
import Employees from './pages/Employees';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './App.css';

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/add" element={<AddEquipment />} />
            <Route path="/equipment/edit/:id" element={<EditEquipment />} />
            <Route path="/attribution" element={<Attribution />} />
            <Route path="/attribution/assign" element={<AssignEquipment />} />
            <Route path="/src/pages//Employees/index.jsx" element={<Employees />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </DataProvider>
  );
};

export default App;