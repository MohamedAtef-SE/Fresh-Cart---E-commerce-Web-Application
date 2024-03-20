import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { authContext } from "./AuthContextProvider";


export const addressContext = createContext();


export default function AddressProvider({ children }) {

    const [pickedAddress, setPickedAddress] = useState(undefined);

    const [allAddress, setAllAddress] = useState(null);

    const { token } = useContext(authContext);

    useEffect(() => {

        getLoggedUserAddress();


    }, [token])

    async function addAddress(data) {

        return await axios.post('https://ecommerce.routemisr.com/api/v1/addresses', {
            "name": data.name,
            "details": data.details,
            "phone": data.phone,
            "city": data.city
        }, {

            headers: {
                token: localStorage.getItem('tkn'),
            },
        }
        )
            .then((response) => {
                setAllAddress(response.data.data);
                return response.data;
            })
            .catch((err) => {
                console.log(err.response)
                return err.response;
            })
    }

    async function removeAddress(address_id) {

        return axios.delete(`https://ecommerce.routemisr.com/api/v1/addresses/${address_id}`,
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                },
            })
            .then((response) => {
                setAllAddress(response.data.data);
                return response.data;

            })
            .catch((err) => {
                return err;
            })

    }

    async function getAddress(address_id) {

        return axios.get(`https://ecommerce.routemisr.com/api/v1/addresses/${address_id}`,
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                return err;
            })

    }
    async function getLoggedUserAddress() {

        return axios.get(`https://ecommerce.routemisr.com/api/v1/addresses`,
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                },
            })
            .then((response) => {
                if (response.data.data != 0) {
                    setAllAddress(response.data.data);
                    console.log('lalalalal')
                }
                return response.data;
            })
            .catch((err) => {
                return err;
            })

    }


    return <addressContext.Provider value={{ addAddress, removeAddress, getAddress, getLoggedUserAddress, allAddress, pickedAddress, setPickedAddress }}>
        {children}
    </addressContext.Provider>





}