import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react"

export const authContext = createContext();

export default function AuthContextProvider({ children }) {



    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        if (localStorage.getItem('tkn')) {
            setToken(localStorage.getItem('tkn'));
            getUserData();
            console.log('getUserData')
        }

    }, [])


    function getUserData() {
        setUserData(jwtDecode(localStorage.getItem('tkn')));
        console.log('seted user data successful');
    }



    return <authContext.Provider value={{ tkn: token, tknFn: setToken, getUserData, userData }}>
        {children}
    </authContext.Provider>
}