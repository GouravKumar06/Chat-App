import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from '../server';

const Login = () => {
     
    const navigate = useNavigate();

    const [values,setValues] = useState({
        username: "",
        password: "",
    })

    const handleChange = (e) =>{
        setValues({
            ...values,
            [e.target.name]:e.target.value
        })
    }

    useEffect(()=>{
      if(localStorage.getItem("chat-app-user"))
      {
        navigate("/");
      }
    },[navigate]);
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if( handleValidation() )
        { 
            const {username,password} = values;

            const {data} = await axios.post(`${server}/api/user/login`,{
              username,
              password,
            })

            if(data.success === false)
            {
                toast.error(data.message)
            }

            if(data.success === true)
            {
              localStorage.setItem("chat-app-user",JSON.stringify(data.user));
              toast.success(data.message)
              navigate("/");
            }

        } 
    }

    const handleValidation = () =>{
      const {password,username} = values;        
      if(password === ""){
        toast.error("Passwords is required");
        return false;
      }
      else if(username.length === ""){
        toast.error("Username is required");
        return false;
      }
      return true;
    }
  return (
    <>
      <FormContainer>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className='brand'>
            <img src={logo} alt="Logo" />
            <h1>Snappy</h1>
          </div>
          <input
            type="text"
            placeholder='Username...'
            name='username'
            onChange={(e)=>handleChange(e)}
          />
          <input
            type="password"
            placeholder='Password...'
            name='password'
            onChange={(e)=>handleChange(e)}
          />
          <button type='submit'>Login User</button>
          <span>
            Not have an account?
            <Link to="/register">
              Register
            </Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;


export default Login