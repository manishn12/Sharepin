import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker,Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import './App.css';
import {format} from 'timeago.js'
import Register from './components/Register';
import Login from './components/Login';
import { axiosInstance } from './config';
import axios from 'axios';

require('dotenv').config();

function App() {

const myStorage = window.localStorage;
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pins,setPins]  = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 28.4,
    longitude: 77.2,
    zoom: 4
  });

 useEffect(() =>{
  //  const getPins = async ()=>{
  //    try{
  //      const res = await axios.get("/pins");
  //      console.log(res);
  //      setPins(res.data);
  //    }catch(err){
  //      console.log(err);
  //    }
  //  };
  //  getPins();
  axiosInstance.get("/pins")
  .then(res=>{
    console.log(res)
    setPins(res.data);
  })
  .catch(err=>console.log(err))
 },[]);


const handleMarkerClick = (id,lat,long) =>{
setCurrentPlaceId(id);
setViewport({...viewport,latitude:lat,longitude:long});
}

const handleAddClick = (e) =>{
  
const [long,lat] = e.lngLat;
setNewPlace({
  lat:lat,
  long:long,
})
//console.log(e);
}


const handleSubmit= async (e) =>{
  e.preventDefault();
  const newPin = {
    username:currentUser,
    title,
    desc,
    rating,
    lat: newPlace.lat,
    long: newPlace.long
  }

try{
const res = await axiosInstance.post("/pins",newPin);
setPins([...pins,res.data])
setNewPlace(null);
}catch(err){
  console.log(err);
}

}

const handleLogout =() =>{
  myStorage.removeItem("user");
  setCurrentUser(null);
}


  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = "pk.eyJ1IjoibWFuaXNobjEiLCJhIjoiY2t0b21rd2UwMDF1cDMybXBpazJxcHg2cyJ9.BMTzVOetWCZBdKEgXX3fRg"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle= "mapbox://styles/manishn1/cktg3e41d3uy917p9arkm7dxh"
      onDblClick ={currentUser && handleAddClick}
      transitionDuration="300"
    >

{pins.map(p=>(

<>

      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom *3.5} offsetTop={-viewport.zoom *7}>
        <RoomIcon style={{color: p.username === currentUser?"tomato": "slateblue", fontSize: viewport.zoom *7, cursor:"pointer"}}  onClick={() => handleMarkerClick(p._id,p.lat,p.long)} />
      </Marker>

      {p._id === currentPlaceId && (

      
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={() =>setCurrentPlaceId(null)}
          >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
            {Array(p.rating).fill(<StarIcon className="star"/>)}
           
            </div>
            <label>Information</label>
            <div>
              <span className="username">Created by <b>{p.username}</b></span>
              <br/>
              <span className="date">{format(p.createdAt)}</span>
            </div>

          </div>
        </Popup> 
        )}
</>
        ))}
{newPlace && ( 

        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={() =>setNewPlace(null)}
          ><div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter a Title" onChange={(e) => setTitle(e.target.value)}/>
              <label>Review</label>
              <textarea placeholder="Say us something about this stuff." onChange={(e) => setDesc(e.target.value)} />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)} >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </div></Popup>
          )}
{currentUser ? (<div className="buttons">
<button className="button logout" onClick={handleLogout}>Log out</button>
<button className="button profile">{currentUser}</button>
</div>) : (
  <div className="buttons">
<button className="button login" onClick={()=>{setShowLogin(true) 
setShowRegister(false)
}}>Log in</button>
<button className="button register"  onClick={()=>{setShowRegister(true)
setShowLogin(false)
}}>Register</button>
</div>
)}
{showRegister && <Register setShowRegister={setShowRegister} />}
  {showLogin && <Login setShowLogin ={setShowLogin} myStorage={myStorage} setCurrentUser ={setCurrentUser} /> }
    </ReactMapGL>
   

    </div>
  );
}



export default App;
