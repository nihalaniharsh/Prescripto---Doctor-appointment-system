import React, { useCallback, useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Allappointments from './pages/admin/Allappointments';
import Dashboard from './pages/admin/Dashboard';
import AddDoctor from './pages/admin/AddDoctor';
import DoctorsList from './pages/admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';

const App = () => {


  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ?(
    <div className='bg-[#F8F9FD]'>
       <ToastContainer/>
       <Navbar/>
       <div className='flex items-start'>
        <Sidebar/> 
        <Routes>
          {/* admin routes */}
        <Route path='/' element={<></>} />
        <Route path='/admin-dashboard'  element={<Dashboard /> }/>
        <Route path='/all-appointments' element={<Allappointments/>}/>
        <Route path='/add-doctor' element={<AddDoctor/>}/>
        <Route path='/doctor-list' element={<DoctorsList/>}/>

        {/* doctor routes */}
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
        <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
        <Route path='/doctor-profile' element={<DoctorProfile/>}/>


        </Routes>
       </div>
       
      
       
    </div>
  ) : (
    <>
    <Login/>
      <ToastContainer/>

    </>
  )
}

export default App