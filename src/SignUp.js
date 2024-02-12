import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';


function SignUpComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [erroMessage, setErrorMessage] = useState('')

    const isValidEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
    const isValidPassword = (pw) => {
        return /[A-Z]/.test(pw) &&
            /[a-z]/.test(pw) &&
            /[0-9]/.test(pw) &&
            /[^A-Za-z0-9]/.test(pw) &&
            pw.length > 4;

    }
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!isValidEmail(username)) {
            setErrorMessage('Uh Oh! make sure the email is valid')
            return
        }
        if (!isValidPassword(password)) {
            setErrorMessage('Make sure password has 1 Upper case, 1 Lower case, 1 one digit, 1 special symbol, min length is 4')
            return
        }
        try {
            const response = await axios.post('https://kaizntree-charan-448e5dca4b32.herokuapp.com/register/', {
                username: username,
                password: password,
            });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            // Handle errors (e.g., username already exists)
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://kaizntree-charan-448e5dca4b32.herokuapp.com/login/', {
                username: username,
                password: password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(`Invalid Credentials, let's try again`)
        }
    };

    return (
        <form className="form-container">
            <div className='kaizntree-logo'>
                <img src="https://static.wixstatic.com/media/29e8d0_8b0f74ea83984e15beecd6ec7e2d6531~mv2.webp" alt="Kaizntree Logo" />
                <div className="kaizntree-text">Kaizntree</div>

            </div>
            <input
                type="text"
                value={username}
                onChange={(e) => {
                    setErrorMessage('')
                    setUsername(e.target.value)
                }}
                placeholder="Username"
                required
                className="input-field"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => {
                    setErrorMessage('')
                    setPassword(e.target.value)
                }}
                placeholder="Password"
                required
                className="input-field"
            />
            {erroMessage && <div className='error-message'>{erroMessage}</div>}

            <div className="buttons-container">
                <button type="submit" className='create-account' onClick={handleSignUp}>Create Account</button>
                <button type="button" className='login' onClick={handleLogin}>Login</button>
            </div>
            <div className='forgot-password'>
                <button type="button" onClick={() => {/* Logic for forgot password */ }} className="forgot-password-btn">
                    Forgot Password?
                </button>
            </div>

        </form>
    );
}

export default SignUpComponent;
