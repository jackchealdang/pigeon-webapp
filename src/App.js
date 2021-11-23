import React, { useRef, useState } from 'react';
import './App.css';

// firebase SDKs
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

// firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCqstgp05ShXkUoceVCuczZbMHnbohxBjE",
  authDomain: "superchat-a9ea9.firebaseapp.com",
  projectId: "superchat-a9ea9",
  storageBucket: "superchat-a9ea9.appspot.com",
  messagingSenderId: "969693249636",
  appId: "1:969693249636:web:9409b55907102ba710df71",
  measurementId: "G-EZCWYLQ8C0"
  })

// reference to firebase auth and firestore as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {

  // use user object to check signed in or signed out
  // signed in == object
  // signed out == null
  const [user] = useAuthState(auth);
  return (
    <div className="App">
    <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
    </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  

  // listen to updates to database using useCollectionData hook
  const [messages] = useCollectionData(query, {idField: 'id'});

  // staple value??
  const [formValue, setFormValue] = useState('')

  // event handler with async function with event e as argument
  const sendMessage = async(e) => {
    // prevent page from refresh on new message
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    // write new document to database
    // takes json
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  // in the template, map over array of messages, rerender new messages
  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
    </main>
    {/*create box for user input*/}
    {/*write value to firestore*/}
    <form onSubmit={sendMessage}>
    {/*bind formValue to formValue state and listen for changes as new value*/}
    {/*"bind state for form input"*/}
}    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
    <button type="submit">🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  // see if message was sent or received by comparing uid's
  // example of conditional CSS
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
