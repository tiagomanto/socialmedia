import React, {useContext} from 'react'
import styled from 'styled-components/native'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext'

import Text from '../components/Text'

export default ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const logOut = async ()=>{
        const loggedOut = await firebase.logOut()

        if (loggedOut){
            setUser(state => ({...state, isLoggedIn:false}))
        }
    }

    return (
      <Container>
          <ProfilePhotoContainer >
              <ProfilePhoto source={user.profilePhotoUrl ==="default" 
              ? require("../../assets/defaultProfilePhoto.jpg")
              : {uri: user.profilePhotoUrl}} />
          </ProfilePhotoContainer>
          <Text medium bold margin="16px 0 32px 0">{user.username}</Text>
        
        <StatsContainer>
            <StatContainer>
                <Text large light>
                    21
                </Text>
                <Text small bold color="#c2c4cd">
                    Posts
                </Text>
            </StatContainer>
            <StatContainer>
                <Text large light>
                    981
                </Text>
                <Text small bold color="#c2c4cd">
                    Seguidores
                </Text>
            </StatContainer>
            <StatContainer>
                <Text large light>
                    63
                </Text>
                <Text small bold color="#c2c4cd">
                    Seguindo
                </Text>
            </StatContainer>
        </StatsContainer>

        <Logout onPress={logOut}>
            <Text medium bold color="#23a8d9">Log out</Text>
        </Logout>


      </Container>
    )
}



const Container = styled.View `
    align-items:center;
    margin-top: 64px;
    flex:1;
`
const ProfilePhotoContainer = styled.View `
    width:130px;
    height:130px;
    border-radius:128px;
    align-items:center;
    justify-content:center;
    box-shadow: 1px 2px 1px rgba(0,0,0,0.25);
    shadow-opacity: 0.8;
    shadow-radius: 38px;
    shadow-color: #222222;
    
`

const ProfilePhoto = styled.Image `
    width: 120px;
    height: 120px;
    border-radius: 128px;
`
const StatsContainer = styled.View `
    flex-direction:row;
    justify-content:space-between;
    margin: 0 32px;
    flex:1;
`;

const StatContainer = styled.View `
    align-items:center;
    flex:1;
`
const Logout = styled.TouchableOpacity `
    margin-bottom: 32px;

`