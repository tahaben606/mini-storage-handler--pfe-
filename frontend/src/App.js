import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './Context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/home';
import AddEmployee from './pages/Employees/AddEmployee';
import EditEmployee from './pages/Employees/EditEmployee';

import AddEquipment from './pages/Equipment/AddEquipment';
import EditEquipment from './pages/Equipment/EditEquipment';

import AssignEquipment from './pages/Attribution/AssignEquipment';

import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';

import Employees from './pages/Employees/index';
import Equipment from './pages/Equipment/index';
import Attribution from './pages/Attribution/index';
import UEquipment from './pages/Equipment/UIndex';
import UAttribution from './pages/Attribution/UIndex';
import UEmployees from './pages/Employees/UIndex';
import EquipmentDetails from './pages/Equipment/EquipmentDetails';

import './App.css';

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/equipment/details/:id" element={<EquipmentDetails />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/index" element={<UEquipment />} />
            <Route path="/employees/index" element={<UEmployees />} />
            <Route path="/attribution/index" element={<UAttribution />} />
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