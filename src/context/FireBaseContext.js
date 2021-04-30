import React,{ createContext } from 'react'

import firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";
import config from '../config/firebase'
import uuid from 'uuid-v4'

const FirebaseContext = createContext();

if (!firebase.apps.lenght){
    firebase.initializeApp(config)
}

const db = firebase.firestore();
//const uid= uuid();

const Firebase = {

    getCurrentUser: () =>{
        return firebase.auth().currentUser
    },

    createUser: async (user) =>{
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default";

            await db.collection("users").doc(uid).set({
                username: user.username,
                email: user.email,
                profilePhotoUrl
            })

            if (user.profilePhoto){
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto)

            }

            delete user.password;

            return {...user, profilePhotoUrl, uid}

        }catch(error) {
            console.log("Error @createUser: ",error.message)
        }
    },

    // getUsersMessages:() =>{
    //     db.collection("posts")
    //     .get()
    //     .then((query) =>{
    //             query.forEach((doc) =>{
    //                 console.log(doc.id, "=>", doc.data());
    //             })
    //         })
    //     .catch((error)=>{
    //         console.log("Error getting documents", error);
    //     })
    // },

    
    uploadProfilePhoto: async (uri)=>{
        const uid = Firebase.getCurrentUser().uid;

        try{
            const photo = await Firebase.getBlob(uri)

            const imageRef = firebase.storage().ref("profilePhotos").child(uid)
            await imageRef.put(photo)

            const url = await imageRef.getDownloadURL()

            await db.collection("users").doc(uid).update({
                profilePhotoUrl: url
            });

            return url;
        } catch (error){
            console.log("Error @uploadProfilePhoto: ",error)
        }
    },

    createPost: async (post) =>{
        const uid = Firebase.getCurrentUser().uid;
        try {
            //await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
           
            let postPhotoUrl = "default";
            
            
            if (post.postPhoto){
                postPhotoUrl = await Firebase.uploadPostPhoto(post.postPhoto)
              

            }
            await db.collection("posts").doc(uid).collection('messages').add(
                {
                    messages: post.message,
                    postPhotoUrl
                })

            

            //delete user.password;

            return {...post, postPhotoUrl, uid}

        }catch(error) {
            console.log("Error @createPost: ",error.message)
        }
    },

    uploadPostPhoto: async (uri)=>{
        
        //const  uid = uuid();
        const uid = Firebase.getCurrentUser().uid;
        try{
            const photo = await Firebase.getBlob(uri)

            const imageRef = firebase.storage().ref("postPhotos").child(uid)
            await imageRef.put(photo)

            const url = await imageRef.getDownloadURL()

            await db.collection("posts").doc(uid).collection('messages').get({
                postPhotoUrl: url
            });

            return url ;
        } catch (error){
            console.log("Error @uploadPostPhoto: ",error)
        }
    },

    getBlob: async (uri) =>{
        return await new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest()

            xhr.onload = () =>{
                resolve(xhr.response)
            }

            xhr.onerror = () =>{
                reject(new TypeError("Network request failed. "))
            }

            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })
    },

    getUserInfo: async (uid) =>{
        try {
            const user = await db.collection("users").doc(uid).get()

            if (user.exists){
                return user.data()
            }
        } catch (error) {
            console.log("Error @getUserInfo: ", error)
        }
    },

    logOut: async () =>{
        try{
            await firebase.auth().signOut();

                
            return true
        }catch (error){
            console.log("Error @logOut: ", error)
        }

        return false;
    },

    signIn: async(email, password) =>{
        return firebase.auth().signInWithEmailAndPassword(email,password)
    },
}

const FirebaseProvider = (props)=>{
    return <FirebaseContext.Provider value ={Firebase}>{props.children}</FirebaseContext.Provider>
}

export {FirebaseContext, FirebaseProvider, firebase, db}