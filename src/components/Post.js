import React,{useState, useEffect} from 'react'
import "./Post.css"
import Avatar from '@material-ui/core/Avatar';
import {db} from "../firebase";
import firebase from 'firebase';

function Post({image,caption,user,postId,username}) {

    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState('');
    console.log(postId);

    useEffect(()=>{            //This useEffect will fetch all the comments from post.
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            })
        }
        return()=>{
            unsubscribe();
        }
    },[postId])

    const postComment=(e)=>{
        e.preventDefault();
        db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');


    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" src={image} alt="img"/>
                <h1>{username}</h1>   
                {console.log(user)}
            </div>
            <img className="post__img" src={image} alt="img"/>
            <h3 className="post__text"><strong>{username}:</strong>{caption}</h3>
            <div className="post__comment">
                {comments.map((comment)=>(<p className="post__commentsingle">
                    <strong className="post__commentmargin">
                        {comment.username}:
                    </strong>
                    {comment.text}
                </p>))}
            </div>
            {user&&(
                <form className="post__commentbox">
                <input 
                className="post__input"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                /> 
                <button 
                className="post__button"   
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >Post</button>
            </form>)}
            
            



            
        </div>
    )
}

export default Post
