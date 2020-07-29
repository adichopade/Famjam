import React,{useState} from 'react'
import { Button } from '@material-ui/core'
import {storage,db} from "../firebase"
import firebase from 'firebase';
import "./Imageupload.css"

function Imageupload({username}) {
    console.log(username);
    const [caption, setCaption]=useState('');
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);
    
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    const handleUpload=()=>{
        const uploadTask=storage.ref(`image/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress=Math.round(
                    (snapshot.bytesTransferred)/(snapshot.totalBytes)*100
                )
                setProgress(progress);
            },
            (error)=>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage.ref("image")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        image:url,
                        username:username
                    })
                    console.log(username)
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )

    }
    
    return (
        <div className="imageupload">
            <progress className="imageupload__progressbar" value={progress} max="100"/>
            <input type="text" placeholder="Enter a caption" value={caption} onChange={e=>setCaption(e.target.value)}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
            
        </div>
    )
}

export default Imageupload
