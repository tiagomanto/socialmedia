import React,{useState, useContext} from 'react'
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import Text from '../components/Text'

import { FirebaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'


export default function SignInScreen({navigation}){
    const [email, setEmail]= useState();
    const [password, setPassword]= useState();
    const [loading, setLoading] = useState(false)
    const firebase = useContext(FirebaseContext)
    const [_, setUser] = useContext(UserContext)

    const SignIn = async() =>{
        setLoading(true)

        try{
            await firebase.signIn(email, password);

            const uid = firebase.getCurrentUser().uid;

            const userInfo = await firebase.getUserInfo(uid);

            setUser({
                username: userInfo.username,
                email:userInfo.email,
                uid,
                profilePhotoUrl: userInfo.profilePhotoUrl,
                isLoggedIn: true,
            });
        } catch (error){
            alert(error.message);
        } finally {
            setLoading(false)
        }
    }
    return (
         <Container>
            <Main>
                <Text title semi center>Bem vindo!</Text>
            </Main>

            <Auth>
                <AuthContainer>
                    <AuthTitle>Endereço de Email</AuthTitle>
                        <AuthField 
                            autoCapitalize='none' 
                            autoCompleteType='email' 
                            autoCorrect={false} 
                            autoFocus={true}
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

            <SignInContainer onPress={SignIn} disabled={loading}>
                { loading ? (
                    <Loading />
                ):(
                    <Text bold center color="#fff">
                        Login
                    </Text>
                )}    
            </SignInContainer>
            
            <SignUp onPress={()=> navigation.navigate("SignUp")}>
                <Text small center>
                    Novo no Social App? <Text bold color="#8022d9">Cadastre-se</Text></Text>
            </SignUp>

            <HeaderGraphic>
                <RightCircle />
                <LeftCircle />

            </HeaderGraphic>
            <StatusBar barStyle="light-content"/>
            <RodapeTeclado/>
        </Container>
    )
}
const Container = styled.View `
   
    flex:1;
    
`
const Main = styled.View`
    margin-top:150px;
    flex:0.2;

`
const Auth = styled.View `
    margin: 60px 32px 15px; 
`

const AuthContainer = styled.View`
    margin-bottom: 10px;
`

const AuthTitle = styled(Text)`
    color:#8e93a1;
    font-size:12px;
    text-transform:uppercase;
    font-weight:300;
`

const SignInContainer = styled.TouchableOpacity`
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

const SignUp = styled.TouchableOpacity`
    margin-top: 16px;
`

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
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
    width:400px;
    height:400px;
    border-radius:200px;
    right: -100px;
    top: -200px;
`

const LeftCircle = styled.View `
    background-color:#23a6d5;
    position:absolute;
    width:200px;
    height:200px;
    border-radius:100px;
    left: -50px;
    top: -50px;
`

const RodapeTeclado = styled.View `
    flex:0.5;
    margin-bottom:20px
`
//const StatusBar = styled.StatusBar``