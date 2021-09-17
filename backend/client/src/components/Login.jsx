import React ,{useState, useRef} from 'react'
import './login.css';
import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';
import { axiosInstance } from '../config';

function Login({setShowLogin, myStorage,setCurrentUser}) {
    const [success,setSuccess] = useState(false);
    const [error,setError ] = useState(false);
   const nameRef = useRef();

   const passwordRef = useRef();
   

const handleSubmit =async (e) =>{
    e.preventDefault();
    const user= {
        username: nameRef.current.value,
        password : passwordRef.current.value,
    };

    try{
      const res =  await axiosInstance.post("/users/login",user);
       myStorage.setItem("user",res.data.username);
       setCurrentUser(res.data.username);
       setShowLogin(false);
       setError(false);
       setSuccess(true);
    }catch(err){
        console.log(err);
        setError(true);
    }

}

    return (
         <div className="loginContainer">
            <div className="logo">
                <RoomIcon/> SharePIN
            </div>
            <form onSubmit={handleSubmit }>
                <input type="text" placeholder="Username" ref={nameRef} />
                <input type="password" placeholder="Password" ref={passwordRef} />
                <button className="loginBtn" type="submit">Login</button>

                
                {error && ( <span className="failure">Something went wrong</span>)}
               
            </form>
        <CancelIcon className="loginCancel" onClick ={() =>setShowLogin(false)}/>
        </div>
    )
}

export default Login
