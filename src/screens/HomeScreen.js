import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import {Entypo, Ionicons } from "@expo/vector-icons"

import Text from '../components/Text'
import tempData from '../../tempData'
import { UserContext } from '../context/UserContext'
import { db, FirebaseContext } from '../context/FireBaseContext'


export default HomeScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const [posts, setPosts] = useState([])
    const firebase = useContext(FirebaseContext)
  
     /* const getPosts = async () =>{
        const postslist = db
        .collection("posts").get().then((querysnapshot)=>{
            querysnapshot.forEach((doc)=>{
                console.log(doc.id, " => ", doc.data()); 
            })
        })
        return postslist    
    } */
                

        useEffect(()=>{

            const userslist = db
            .collection("posts").doc(user.uid)
            .collection("messages")
            .onSnapshot(snapshot =>(
                setPosts(snapshot.docs.map(
                    doc =>({
                        id: doc.id,
                        data:doc.data()
                    })
                ))
            ))
           //  console.warn(users.length)
        
             return userslist 
                 
        },[])

    const renderPost = ({item}) => <PostContainer>
        <PostHeaderContainer>
            
            <PostProfilePhoto source={{uri: item.data.profilePhotoUrl}} />
            <PostInfoContainer>
                <Text medium> {item.data.username}</Text>
                <Text tiny color="#c1c3cc" margin="4px 0 0 0">{item.data.email}</Text>
            </PostInfoContainer>
            <Options>
                <Entypo name="dots-three-horizontal" size={16} color="#73788b" />
            </Options>
        </PostHeaderContainer>
        <Post>
            
            <PostPhoto source={{uri: item.data.postPhotoUrl}} />
            <Text>{item.data.messages.toString()}</Text>
            <PostDetails>
                <PostLikes>
                    <Ionicons name="ios-heart-circle" size={24} color="#73788b" />
                    <Text tiny margin="0 0 0 8px">100 </Text>
                </PostLikes>
                <PostComments>
                    <Ionicons name="ios-chatbox" size={24} color="#73788b" />
                    <Text tiny margin="0 0 0 8px"> 200</Text>
                </PostComments>
            </PostDetails>
        </Post>
       </PostContainer> 
       
    
    return (
        <Container>
            <FeedContainer>
                
                <Text large light margin="10px 0 0 0" center>Feed</Text>
                {posts.map(({ id, data: { email, profilePhotoUrl, username }})=>(
                    <>
                    
                    <Feed data={posts} renderItem={renderPost} 
                    keyExtractor={item=>item.id} key={id}>
                    
                    </Feed>

                    </>
                 ))}
               
            </FeedContainer>

            <StatusBar barStyle="dark-content"/>
        </Container>
    )
}

const Container = styled.View `
    flex:1; 
    background-color:#ebecf3;    
`;

const FeedContainer = styled.View ``;

const Feed = styled.FlatList`
    margin-bottom:60px;
`;

const PostContainer = styled.View`
    margin: 16px 16px 0 16px;
    background-color:#fff;
    border-radius:6px;
    padding:8px;
`

const PostHeaderContainer = styled.View`
    flex-direction:row;
    margin-bottom:16px;
    align-items:center;

`

const PostProfilePhoto = styled.Image`
    width:48px;
    height:48px;
    border-radius:24px;
`;

const PostInfoContainer = styled.View`
    flex:1;
    margin:0 16px;

`;

const Options = styled.View ``;

const Post = styled.View`
    margin-left:0px;
`

const PostPhoto = styled.Image `
    width:100%;
    height:150px;
    border-radius:6px;
`
const PostDetails = styled.View `
    flex-direction:row;
    margin-top:8px;
`

const PostLikes = styled.View `
    flex-direction: row;
    align-items:center;
`

const PostComments = styled.View `
    flex-direction: row;
    align-items:center;
    margin-left:16px;
`



const StatusBar = styled.StatusBar ``;
