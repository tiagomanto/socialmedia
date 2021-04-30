import React,{useContext, useState} from 'react'
import { StatusBar,Platform,StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/AntDesign';
import Text from '../components/Text'

import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { FirebaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'

export default PostScreen = () => {
    Icon.loadFont()
    const [username, setUsername]= useState();
    const [email, setEmail]= useState();
    const [password, setPassword]= useState();
    const [loading, setLoading] = useState(false)
    const [postPhoto, SetPostPhoto] = useState()
    const [message, setMessage] = useState()
    const firebase = useContext(FirebaseContext)
    const [_, setUser] = useContext(UserContext)

    const getPermission = async() =>{
        if (Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            
            return status;
        }
    }

    const pickImageCam = async () =>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.5
            });

            if (!result.cancelled){
                SetPostPhoto(result.uri)
            }

        }catch (error) {
            console.log("Error @pickImage: ", error)
        }
    }

    const addPhotoPost = async ()=> {
        const status = await getPermission();

        if (status !== "granted"){
            alert(status)
            alert("Precisamos de permissão para acessar sua camera")
            return;
        }

        pickImageCam()
    } 

    const postImage = async () =>{
        setLoading(true)
       
        const post = { postPhoto, message}
        
        try {
            const createdPost = await firebase.createPost(post)
            
            setUser({...createdPost, isLoggedIn:true})
        } catch (error) {
            console.log("Error @signUp: ", error);
        }
    }
    return (
        <Container onPress={addPhotoPost}>
            {postPhoto ? (
                <>
                
                <PostImage source={{uri:postPhoto}}/>
                <ButtonPost onPress={postImage}><Text color="#fff">Postar</Text></ButtonPost>
                <Message style={{borderBottomColor:"red"}} onChangeText={message =>setMessage({ message })}/>
                </>
            ):(
                <Text bold medium>Seleciona photo </Text>
            )}
            
            
        </Container>

    )
}
const ButtonPost = styled.TouchableOpacity `
    width:200px;
    height:50px;
    border-radius:20px;
    background-color:purple;
    align-items:center;
    justify-content:center;
    
`
const Message = styled.TextInput`
    width:100%;
    height:40px;
    

`
const Container = styled.TouchableOpacity `
    flex:1;
    justify-content:center;
    align-items:center;
`
const PostImage = styled.Image `
    align-items:center;
    width:80%;
    justify-content:center;
    flex:0.8;
    margin-top:10px;
    margin-bottom:10px

`;
