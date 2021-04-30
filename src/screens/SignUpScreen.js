import React,{useContext, useState} from 'react'
import { StatusBar,Platform } from 'react-native'
import styled from 'styled-components/native'
import Text from '../components/Text'
import Icon from 'react-native-vector-icons/AntDesign';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { FirebaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'


export default function SignUpScreen({navigation}){
    Icon.loadFont()
    const [username, setUsername]= useState();
    const [email, setEmail]= useState();
    const [password, setPassword]= useState();
    const [loading, setLoading] = useState(false)
    const [profilePhoto, SetProfilePhoto] = useState()
    const firebase = useContext(FirebaseContext)
    const [_, setUser] = useContext(UserContext)

    const getPermission = async() =>{
        if (Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            
            return status;
        }
    }

    const pickImage = async () =>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.5
            });

            if (!result.cancelled){
                SetProfilePhoto(result.uri)
            }

        }catch (error) {
            console.log("Error @pickImage: ", error)
        }
    }

    const addProfilePhoto = async ()=> {
        const status = await getPermission();

        if (status !== "granted"){
            alert(status)
            alert("Precisamos de permissão para acessar sua camera")
            return;
        }

        pickImage()
    }

    const signUp = async () =>{
        setLoading(true)
        const user = { username, email, password, profilePhoto}
        try {
            const createdUser = await firebase.createUser(user)
            setUser({...createdUser, isLoggedIn:true})
        } catch (error) {
            console.log("Error @signUp: ", error);
        }
    }
    return (
        <Container>
            <Main>
                <Text title semi center>
                    Iniciando seu cadastro
                    </Text>
            </Main>

            <ProfilePhotoContainer onPress={addProfilePhoto}>
                {profilePhoto ? (
                    <ProfilePhoto source={{uri:profilePhoto}} />
                ):(
                    <DefaultProfilePhoto>
                        <Icon name="plus"  size={24} color="#fff" />
                    </DefaultProfilePhoto>
                )}
                
            </ProfilePhotoContainer>

            <Auth>
                <AuthContainer>
                    <AuthTitle>Usuario</AuthTitle>
                        <AuthField 
                            autoCapitalize='none' 
                            autoCorrect={false} 
                            autoFocus={true}
                            onChangeText={username=>setUsername(username.trim())}
                            value={username}
                        />
                </AuthContainer>
                <AuthContainer>
                    <AuthTitle>Endereço de Email</AuthTitle>
                        <AuthField 
                            autoCapitalize='none' 
                            autoCompleteType='email' 
                            autoCorrect={false} 
                            keyboardType="email-address"
                            onChangeText={email=>setEmail(email.trim())}
                            value={email}
                        />
                </AuthContainer>
                <AuthContainer>
                    <AuthTitle>Senha</AuthTitle>
                        <AuthField 
                            autoCapitalize='none' 
                            autoCompleteType='password' 
                            autoCorrect={false} 
                            secureTextEntry={true}
                            onChangeText={password=>setPassword(password.trim())}
                            value={password}
                        />
                </AuthContainer>
            </Auth>

            <SignUpContainer  onPress={signUp} disabled={loading}>
                { loading ? (
                    <Loading />
                ):(
                    <Text bold center color="#fff">
                        Cadastrar
                    </Text>
                )}    
            </SignUpContainer>
            
            <SignIn onPress={()=> navigation.navigate("SignIn")}>
                <Text small center>
                    Possui cadastro? <Text bold color="#8022d9">Faça o Login</Text></Text>
            </SignIn>

            <HeaderGraphic>
                <RightCircle />
                <LeftCircle />

            </HeaderGraphic>
            <StatusBar barStyle="light-content"/>
        </Container>

    )
}
const Container = styled.View `
    flex:1;
    justify-content:center;
`
const Main = styled.View`
    margin-top: 100px;
`
const ProfilePhotoContainer = styled.TouchableOpacity `
    background-color:#e1e2e6;
    width: 60px;
    height: 60px;
    border-radius:40px;
    align-self:center;
    margin-top: 10px;
    overflow:hidden;
`

const DefaultProfilePhoto = styled.View `
    align-items:center;
    justify-content:center;
    flex:1;
`

const ProfilePhoto = styled.Image`
    flex:1;
    
`

const Auth = styled.View `
    margin: 5px 32px 5px; 
`

const AuthContainer = styled.View`
    margin-bottom: 5px;
`

const AuthTitle = styled(Text)`
    color:#8e93a1;
    font-size:12px;
    text-transform:uppercase;
    font-weight:300;
`

const SignUpContainer = styled.TouchableOpacity`
    margin: 0 32px;
    height: 48px;
    align-items:center;
    justify-content:center; 
    background-color:#8022d9;
    border-radius: 6px;
`
const Loading = styled.ActivityIndicator.attrs((props) =>({
    color:'#fff',
    size:"small",
}))``;

const SignIn = styled.TouchableOpacity`
    margin-top: 16px;
`

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 40px;
`

const HeaderGraphic = styled.View`
    position:absolute;
    width: 100%;
    top:-50px;
    z-index:-100;
`

const RightCircle = styled.View `
    background-color:#8022d9;
    position:absolute;
    width:350px;
    height:350px;
    border-radius:200px;
    right: -100px;
    top: -200px;
`

const LeftCircle = styled.View `
    background-color:#23a6d5;
    position:absolute;
    width:180px;
    height:180px;
    border-radius:100px;
    left: -40px;
    top: -40px;
`
//const StatusBar = styled.StatusBar``