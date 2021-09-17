import React ,{useState, useRef} from 'react'
import './register.css';
import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';
import { axiosInstance } from '../config';
import axios from "axios";

function Register({setShowRegister}) {
    const [success,setSuccess] = useState(false);
    const [error,setError ] = useState(false);
   const nameRef = useRef();
   const emailRef = useRef();
   const passwordRef = useRef();
   

const handleSubmit =async (e) =>{
    e.preventDefault();
    const newUser= {
        username: nameRef.current.value,
        email : emailRef.current.value,
        password : passwordRef.current.value,
    };

    try{
      const res =  await axiosInstance.post("/users/register",newUser);
      console.log(res);
       setError(false);
       setSuccess(true);
    }catch(err){
        console.log(err);
        setError(true);
    }

}

    return (
         <div className="registerContainer">
            <div className="logo" style={{color:"tomato"}}>
                <RoomIcon/> SharePIN
            </div>
            <form onSubmit={handleSubmit }>
                <input type="text" placeholder="Username" ref={nameRef} />
                <input type="email" placeholder="Email ID" ref ={emailRef}/>
                <input type="password" placeholder="Password" ref={passwordRef} />
                <button className="registerBtn" type="submit">Register</button>

                {success && (<span className="success">Successfull.You can login now!</span>)}  
                {error && ( <span className="failure">Something went wrong</span>)}
               
            </form>
        <CancelIcon className="registerCancel" onClick ={() =>setShowRegister(false)}/>
        </div>
    )
}

export default Register
