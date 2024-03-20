import axios, { Axios } from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export const productsContext = createContext();


export default function AllProductsProvider({ children }) {

    const [brandID, setBrandID] = useState(undefined);
    const [catID, setCatID] = useState(undefined);
    const [rangePrice, setRangePrice] = useState(undefined);
    const [sortBy, setSortBy] = useState(undefined);

    //   -ratingsAverage &&  ratingsAverage  &&  price  &&  -price  &&  -sold  &&  sold  //

    useEffect(() => {
        getAllProducts();

    }, [brandID, catID, rangePrice])



    async function getTopThree() {

        return axios.get('https://ecommerce.routemisr.com/api/v1/products/?sort=sold&limit=20');
    }

    async function getAllProducts() {
        return axios.get('https://ecommerce.routemisr.com/api/v1/products', {
            params: {
                'brand': brandID,
                'category': catID,
                'price[gte]': rangePrice,
                'sort': sortBy,
            }
        });
    }

    async function getCategories() {

        return await axios.get('https://ecommerce.routemisr.com/api/v1/categories')

    }

    async function getBrands() {

        return await axios.get(`https://ecommerce.routemisr.com/api/v1/brands/`, {
            params: {
                page: 1,
            }
        })
    }


    return <productsContext.Provider value={{ getTopThree, getAllProducts, getBrands, getCategories, setBrandID, setCatID, setRangePrice, setSortBy, sortBy, catID, brandID, rangePrice }}>
        {children}
    </productsContext.Provider>
}