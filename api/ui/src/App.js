import React, { useState, useEffect } from "react";
import './App.css';
import TaskTable from './TaskTable'
import Login from './Login'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsUserSignedIn(true);
    } else {
      setIsUserSignedIn(false)
    };
  }, []);

  const onLoginSuccessful = () => {
    setIsUserSignedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    setIsUserSignedIn(false);
    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className="App">
      {(!isUserSignedIn && (
        <div>
          <Dialog onClose={handleDialogClose} open={isDialogOpen}>
            <DialogTitle>Login</DialogTitle>
            <Login onLoginSuccessful={onLoginSuccessful}/>
          </Dialog>
          <Button 
            onClick={(e)=>setIsDialogOpen(true)}
            ariant="contained" 
            color="primary">
             Login
          </Button>
        </div>
        ))|| (
          <div>
          <Button 
            onClick={(e)=>onLogout()}
            ariant="contained" 
            color="primary">
            Logout
          </Button>
            </div>)}
      <TaskTable isUserSignedIn={isUserSignedIn}/>
      
    </div>
  );
}

export default App;
