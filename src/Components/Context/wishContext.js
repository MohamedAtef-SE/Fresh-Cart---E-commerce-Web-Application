import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";
import { authContext } from "./AuthContextProvider";




export const wishContext = createContext();

export default function WishContextProvider({ children }) {

    const { tkn } = useContext(authContext);
    const [numOfWishProducts, setNumOfWishProducts] = useState(0);
    const [allWishList, setAllWishList] = useState([]);
    const [WishListID, setWishListID] = useState([]);

    useEffect(() => {

        (async function () {
            const x = await getWishList();
            setWishListID(x);
        })();

    }, [tkn]);


    const handleWishlistToggle = (id) => {

        if (WishListID.find((idx) => { return idx == id })) {
            console.log('found it');
            WishListID.splice(WishListID.indexOf(id), 1);
            removeProductFromWishList(id);
        }
        else {
            console.log('NOT found');
            WishListID.push(id);
            addProductToWishList(id);
        }
    }

    async function addProductToWishList(id) {

        return axios.post('https://ecommerce.routemisr.com/api/v1/wishlist',
            {

                "productId": id,
            },
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                }
            }
        ).then((res) => {
            toast.success(res.data.message, { position: 'top-center', icon: <i className="fa-solid fa-heart text-danger fa-2x"></i> });
            getWishList()
            return res;
        }).catch((err) => {
            console.log('can not added to wish list', err);
            return err;
        })
    }

    async function removeProductFromWishList(id) {

        return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
            headers: {
                token: localStorage.getItem('tkn'),
            }
        })
            .then((res) => {
                toast.success(res.data.message, { position: 'top-center', icon: <i className="fa-solid fa-heart text-dark fa-2x"></i> });
                getWishList();
                return res;
            }).catch((err) => {
                return err;
            })

    }

    async function getWishList() {

        return axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
            headers: {
                token: localStorage.getItem('tkn'),
            }
        })
            .then((res) => {
                setNumOfWishProducts(res.data.count);
                setAllWishList(res.data.data);
                const allWishProducts = res.data.data;
                const allWishProductIDs = allWishProducts.map((wishPro) => { return wishPro.id });

                return allWishProductIDs;
            }).catch((err) => {
                return err;
            })

    }


    return <wishContext.Provider value={{
        getWishList,
        numOfWishProducts,
        allWishList,
        handleWishlistToggle,
        WishListID,
    }}>

        {children}


    </wishContext.Provider>
}