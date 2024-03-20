import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
import { authContext } from "./AuthContextProvider";


export const cartContext = createContext();

export default function CartContextProvider({ children }) {

    const { tkn } = useContext(authContext);
    const [numOfCartItems, setNumOfCartItems] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [allCartProducts, setAllCartProducts] = useState(null);
    const [cartID, setCartID] = useState(undefined);

    useEffect(() => {
        getLoggedUserCart();
    }, [tkn]);

    async function getLoggedUserCart() {
        return axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
            headers: {
                token: localStorage.getItem('tkn'),
            }
        })
            .then((res) => {
                setNumOfCartItems(res.data.numOfCartItems);
                setTotalCartPrice(res.data.data.totalCartPrice);
                setAllCartProducts(res.data.data.products);
                localStorage.setItem('userID', res.data.data.cartOwner);
                setCartID(res.data.data._id)
                return res;
            }).catch((err) => {
                return err;
            })
    }

    async function addProductToCart(id) {

        return await axios.post('https://ecommerce.routemisr.com/api/v1/cart',
            {
                'productId': id

            },
            {
                'headers': {
                    token: localStorage.getItem('tkn')
                }
            }
        ).then((res) => {
            // setNumOfCartItems(res.data.numOfCartItems);
            // setTotalCartPrice(res.data.data.totalCartPrice);
            // setAllCartProducts(res.data.data.products);

            // console.log(res.data.data.products.product);

            getLoggedUserCart();
            return true;
        }).catch((err) => {
            return false;
        })
    }

    async function updateCartPorduct(id, newCount) {

        const boolFlag = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
            {
                "count": newCount,
            },
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                }
            })
            .then((res) => {
                setTotalCartPrice(res.data.data.totalCartPrice);
                setAllCartProducts(res.data.data.products);
                setNumOfCartItems(res.data.numOfCartItems);
                console.log(res);
                return true;
            })
            .catch((err) => {
                return false;
            })
        return boolFlag;
    }

    async function deleteCartProduct(id) {
        console.log(id)
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
            headers: {
                token: localStorage.getItem('tkn'),
            }
        })
            .then((response) => {
                setNumOfCartItems(response.data.numOfCartItems);
                setTotalCartPrice(response.data.data.totalCartPrice);
                setAllCartProducts(response.data.data.products);
                console.log('deleted...', response);
                return true;
            })
            .catch((error) => {
                console.log('deleting product Error', error);
                return false;
            })
    }

    async function clearCart() {
        return axios.delete('https://ecommerce.routemisr.com/api/v1/cart', {
            headers: {
                token: localStorage.getItem('tkn'),
            }
        }).then(() => {
            setNumOfCartItems(0);
            setTotalCartPrice(0);
            setAllCartProducts([]);
        }).catch((error) => {

            console.log(error, 'clear');
        })
    }


    return <cartContext.Provider value={{
        getLoggedUserCart,
        addProductToCart,
        numOfCartItems,
        totalCartPrice,
        allCartProducts,
        updateCartPorduct,
        deleteCartProduct,
        clearCart,
        cartID,
        setAllCartProducts,
        setNumOfCartItems,
        setTotalCartPrice,
    }}>
        {children}
    </cartContext.Provider>
}