import React,{useState,useEffect} from 'react';
import Post from "./components/Post"
import {db, auth} from "./firebase"
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Button } from '@material-ui/core';
import Imageupload from "./components/Imageupload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [posts,setposts]=useState([]);
  const [open,setOpen]=useState();
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);
  const [opensignin,setopensignin]=useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(authUser=>{
      if(authUser){
        setUser(authUser); 
        console.log(authUser);
        console.log(authUser.displayName);               //User logged in
      }
      else{
        setUser(null);                       //User logged out
      }
    })
    
  }, [user,username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setposts(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})))
    })
    
  }, [])

  const signUp=(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      console.log(authUser.displayName)
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message));
  }

  

  const signIn=(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setopensignin(false);

  }
  

  return (
    <div className="app">
      
      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <img className="header__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
          <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
        
        
        </div>
        
      </Modal>
      <Modal
        open={opensignin}
        onClose={()=>setopensignin(false)}
        >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <img className="header__logom" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
          <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <Button type="submit" onClick={signIn}>Login</Button>
        </form>
        
        
        </div>
        
      </Modal>
      
      <div className="header">
            <img className="header__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
            {user?(<div className="header__right"><h2 className="header__rightname">{user.displayName}</h2><Button onClick={()=>auth.signOut()}>LogOut</Button></div>):
            (<div>
              <Button onClick={()=>setopensignin(true)}>Login</Button>
              <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            </div>
            )}
      </div>
        <div className="app__posts">
          <div className="app__postsleft">
            {posts.map(({post,id})=>(<Post key={id} postId={id} image={post.image} caption={post.caption} username={post.username} user={user}/>))}
            
          </div>
          <div className="app__postsright">
            <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth='320px'
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}/>
          </div> 
        </div>
        {user?.displayName?(<Imageupload username={user.displayName}/>):
        (<h3>Login to upload..</h3>)}

      
      
      
      
      
      

    </div>
  );
}

export default App;
