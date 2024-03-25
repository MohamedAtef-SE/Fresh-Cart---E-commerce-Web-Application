import axios, { Axios } from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const productsContext = createContext();

export default function AllProductsProvider({ children }) {

    const [brandID, setBrandID] = useState(undefined);
    const [catID, setCatID] = useState(undefined);
    const [rangePrice, setRangePrice] = useState(undefined);
    const [sortBy, setSortBy] = useState(undefined);
    const [pageNumber, setPageNumber] = useState(undefined);
    const [numOfPages, setNumOfPages] = useState(undefined);


    const [activeInputCategory, setActiveInputCategory] = useState('');
    const [activeInputBrand, setActiveInputBrand] = useState('');
    const [activePrice, setActivePrice] = useState('');
    const [customRate, setCustomRate] = useState(0);

    //   -ratingsAverage &&  ratingsAverage  &&  price  &&  -price  &&  -sold  &&  sold  //

    useEffect(() => {
        clearSavedFilter();
    }, []);

    useEffect(() => {
        getAllProducts();
    }, [brandID, catID, rangePrice])



    async function getTopThree() {

        return axios.get('https://ecommerce.routemisr.com/api/v1/products/?sort=sold&limit=20');
    }

    async function getAllProducts() {
        console.log('brand: ', brandID);
        console.log('category: ', catID);
        console.log('Range Price: ', rangePrice);

        return axios.get('https://ecommerce.routemisr.com/api/v1/products', {
            params: {
                'brand': brandID,
                'category': catID,
                'price[gte]': rangePrice,
                'sort': sortBy,
                'page': pageNumber,
            }
        }).then((res) => {

            setNumOfPages(res.data.metadata.numberOfPages);

            return res;
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
    function clearSavedFilter() {
        localStorage.removeItem('catID');
        localStorage.removeItem('brandID');
        localStorage.removeItem('priceRange');
        localStorage.removeItem('customRate');
        setActiveInputBrand('');
        setActiveInputCategory('');
        setActivePrice('');
        setCustomRate(0);
        console.log('cleared');

    }


    return <productsContext.Provider value={{
        activeInputCategory, setActiveInputCategory,
        activeInputBrand, setActiveInputBrand
        , activePrice, setActivePrice, customRate, setCustomRate, clearSavedFilter, getTopThree, getAllProducts, getBrands, getCategories, setBrandID, setCatID, setRangePrice, setSortBy, setPageNumber, setNumOfPages, sortBy, catID, brandID, rangePrice, pageNumber, numOfPages
    }}>
        {children}
    </productsContext.Provider>
}