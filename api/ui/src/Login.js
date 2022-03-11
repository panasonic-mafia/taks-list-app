import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { baseUrl } from './config'

async function login({ user, password }) {
    return await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify({ user, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
            throw new Error(`Login error: incorrect username or password`);
        }
        return response.json();
      })
      .catch((err) => {
        alert(err)
      });
  }


function Login({onLoginSuccessful}) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [onLoad, setOnLoad] = useState(false)

    const handleUserChange = (e) => setUser(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const onSubmit = async (event) => {
        event.preventDefault();
        const loginResult = await login({ user, password });
        if (loginResult) {
          const { name, token } = loginResult;
          // Save user IDs on local storage
          localStorage.setItem("name", name);
          localStorage.setItem("token", token);
          onLoginSuccessful();
          setOnLoad(false);
        } else {
          setOnLoad(false)
        }
      };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <TextField 
                    margin="dense"
                    label="Username"
                    type="user"
                    fullWidth
                    value={user}
                    onChange={(e)=>handleUserChange(e)}
                    required/>
                <TextField 
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e)=>handlePasswordChange(e)}
                    required
                    />
                <Button type='submit' variant="contained" color="primary" disabled={onLoad}>
                    Submit
                </Button>
                {onLoad && (<div>Loading...</div>)}
            </form>
        </div>
    )
}

export default Login;