import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingPage from './../LoadingPage/LoadingPage';
import { cartContext } from "../Context/CartContext";
import toast from "react-hot-toast";
import { productsContext } from "../Context/AllProducts";
import { wishContext } from './../Context/wishContext';
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import Fade from './../Fade/Fade';


export default function Home() {

    const parentOfPageNumBtns = document.querySelector('.parentOfPageNumBtns');
    const priceRange = document.querySelectorAll('.rangePrice');
    const [activeInputCategory, setActiveInputCategory] = useState('');
    const [activeInputBrand, setActiveInputBrand] = useState('');
    const [activePrice, setActivePrice] = useState('');

    const [customRate, setCustomRate] = useState(0);

    const { addProductToCart } = useContext(cartContext);

    const { handleWishlistToggle, WishListID } = useContext(wishContext);

    const { getAllProducts, numOfPages, getCategories, getBrands, setBrandID, brandID, setCatID,
        catID, setRangePrice, sortBy, setSortBy, getTopThree,
        setPageNumber, setNumOfPages } = useContext(productsContext);


    const { data: dataAllProducts, isLoading: loadingAllProducts, refetch } = useQuery({
        queryKey: ['allProducts'],
        queryFn: getAllProducts,
        gcTime: 60000,
    });
    useEffect(() => {
        if (localStorage.getItem('cartID')) {
            setCatID(localStorage.getItem('cartID'));
            setActiveInputCategory(localStorage.getItem('cartID'))
        }
        if (localStorage.getItem('brandID')) {
            setBrandID(localStorage.getItem('brandID'));
            setActiveInputBrand(localStorage.getItem('brandID'))
        }
        if (localStorage.getItem('priceRange')) {
            setRangePrice(localStorage.getItem('priceRange'));
            setActivePrice(localStorage.getItem('priceRange'))
        }
        if (localStorage.getItem('customRate')) {
            setCustomRate(localStorage.getItem('customRate'));
        }
    }, []);


    useEffect(() => {
        for (let i = 0; i < numOfPages; i++) {
            const newButton = document.createElement('span');
            newButton.textContent = `${i + 1}`;
            newButton.classList.add('text-main');
            newButton.classList.add('fw-bolder');
            newButton.classList.add('px-1');
            newButton.setAttribute('role', 'button');
            newButton.classList.add('border-bottom');
            newButton.classList.add('border-3');
            newButton.classList.add('mx-2');
            newButton.addEventListener('click', function () {
                handleCheckList({ page: i + 1 });
            })

            if (parentOfPageNumBtns) {
                parentOfPageNumBtns.appendChild(newButton);

            }

        }

        return () => {
            removeBtns();
        }
    }, [numOfPages, parentOfPageNumBtns])

    function removeBtns() {
        const element = document.querySelector('.parentOfPageNumBtns');
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

    }


    async function addProduct(id) {
        if (localStorage.getItem('tkn')) {
            const res = await addProductToCart(id);

            if (res) {
                toast.success('Added successfully', { duration: 1500, position: "top-center" });
            }
            else {
                toast.error('Something Wrong', { duration: 1500, position: "top-center" });
            }
        }
        else {
            toast.error('Login First.', { position: 'top-center' });
        }
    }


    async function addToWichList(id) {

        if (localStorage.getItem('tkn')) {
            handleWishlistToggle(id);
        }
        else {
            toast.error('Login First.', { position: 'top-center' })
        }
    }

    //=========SIDE BAR============//

    const { data: dataAllCategories, isLoading: loadingAllCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: getCategories,
    });

    const { data: topThree, isLoading: topThreeLoading } = useQuery({
        queryKey: ['topThree'], queryFn: getTopThree
    });

    const { data: dataAllBrands, isLoading: loadingAllBrands } = useQuery({
        queryKey: ['allBrands'],
        queryFn: getBrands,
    });


    function handleCheckList({ eventOwner, page, cat, brand, price, sort }) {
        if (page == undefined && cat == undefined && brand == undefined && price == undefined && sort == undefined) {
            setNumOfPages(undefined);
            setCatID(undefined);
            setBrandID(undefined);
            setRangePrice(undefined);
            setSortBy(undefined)
            setCustomRate(0);
            setActiveInputBrand('');
            setActiveInputCategory('');
            setActivePrice('');
            localStorage.removeItem('cartID');
            localStorage.removeItem('brandID');
            localStorage.removeItem('priceRange');
            localStorage.removeItem('customRate');
        }

        if (cat !== undefined) {

            if (cat.id !== catID) {
                setCatID(cat.id);
            }
            else if (cat.id === catID) {
                cat.checked = false;
                setCatID(undefined);
            }
            setPageNumber(1);
        }

        if (brand !== undefined) {

            if (brand.id !== brandID) {
                setBrandID(brand.id);
            }
            else if (brand.id === brandID) {
                brand.checked = false;
                setBrandID(undefined);
            }
            setPageNumber(1);

        }

        if (price !== undefined) {
            setRangePrice(price);
            setPageNumber(1);

        }

        if (sort !== sortBy) {
            setSortBy(sort);
            setPageNumber(1);
        }

        if (page !== undefined) {
            setPageNumber(page);
        }
        setTimeout(() => { refetch() }, [1000]);
    }

    //========= END SIDE BAR============//

    if (loadingAllProducts || loadingAllBrands || loadingAllCategories || topThreeLoading) {
        return <LoadingPage />
    }


    const productsByRating = dataAllProducts.data.data.filter((product) => { return product.ratingsAverage >= customRate });

    //==================== START Slick-Slider ====================//

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 10,
        slidesToScroll: 1,
        autoplay: true,
        speed: 6000,
        autoplaySpeed: 4000,
        cssEase: "linear"
    };

    //==================== END Slick-Slider ====================//


    function handleActiveCategory(id) {
        setActiveInputCategory(id);
        localStorage.setItem('cartID', id);
    }
    function handleActiveBrand(id) {
        setActiveInputBrand(id)
        localStorage.setItem('brandID', id);
    }

    function handleActivePrice(value) {
        setActivePrice(value);
        localStorage.setItem('priceRange', value);
    }
    function handleCustomRate(value) {
        setCustomRate(value);
        localStorage.setItem('customRate', value);
    }

    return <section className="home position-relative">
        <Helmet>
            <title>Home Page</title>
        </Helmet>
        <div className="container-fluid">
            <div className="Head-part container-fluid m-0 p-0">
                <Fade />
                <div className="my-1 container-fluid">
                    <h4 className="fw-bolder m-0 mx-2 text-dark">Most Popular Sold Items</h4>
                    <div className="slider-container">
                        <Slider {...settings}>
                            {topThree.data.data.map((product) => {
                                return <div key={product.id} className="rounded product">
                                    <Link to={`/productDetails/${product.id}`}>
                                        <div className="p-2 rounded bg-white mx-1">
                                            <img className="w-100 rounded" src={product.imageCover} alt="product" />
                                            <div className="h-75px">
                                                <h6 className="fw-bold my-2 font-sm text-main">{product.category.name}</h6>
                                                <p className="font-sm my-2 fw-bold">{product.title.split(' ').slice(0, 3).join(' ')}</p>
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                            })
                            }
                        </Slider>
                    </div>
                </div>
            </div>

            <div className="main-part container">
                <div className="row">
                    <div className="col-3">
                        <div className="box bg-body-tertiary min-vh-100 p-3 ">
                            <h6 onClick={() => { handleCheckList({ page: undefined, cat: undefined, brand: undefined, price: undefined, sort: undefined }) }} role="button" className="mt-2 text-end text-main"><i className="fa-solid fa-filter-circle-xmark"></i > Clear all</h6>
                            <div className="cat-list my-4">
                                <h6 className="fw-bolder">Categories</h6>
                                <ul className="list-unstyled p-0 m-0">
                                    {dataAllCategories.data.data.map((category) => {
                                        return <li key={category._id}>
                                            <input className={activeInputCategory === category._id ? 'active-radio' : null} onClick={(e) => { handleActiveCategory(category._id); handleCheckList({ cat: e.target }) }} name="category" type="radio" id={category._id} value={category.name} />
                                            <label className="ms-2 font-sm" htmlFor={category._id}>{category.name}</label>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="br-list my-4">
                                <h6 className="fw-bolder">Brands</h6>
                                <ul className="list-unstyled p-0 m-0">
                                    {dataAllBrands.data.data.map((brand) => {
                                        return <li key={brand._id}>
                                            <input className={activeInputBrand === brand._id ? 'active-radio' : ''} onClick={(e) => { handleActiveBrand(brand._id); handleCheckList({ brand: e.target }) }} type="radio" name="brand" id={brand._id} value={brand.name} />
                                            <label className="ms-2 font-sm" htmlFor={brand._id}>{brand.name}</label>
                                        </li>
                                    })}
                                </ul>
                            </div>
                            <div className="price-range my-4">
                                <h6 className="fw-bolder font-sm">Price</h6>
                                <span role="button" onClick={(e) => { handleActivePrice(100); handleCheckList({ eventOwner: e, price: 100 }) }} className={activePrice == '100' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 100</span>
                                <span role="button" onClick={(e) => { handleActivePrice(1000); handleCheckList({ eventOwner: e, price: 1000 }) }} className={activePrice == '1000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 1,000</span>
                                <span role="button" onClick={(e) => { handleActivePrice(3000); handleCheckList({ eventOwner: e, price: 3000 }) }} className={activePrice == '3000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 3,000</span>
                                <span role="button" onClick={(e) => { handleActivePrice(6000); handleCheckList({ eventOwner: e, price: 6000 }) }} className={activePrice == '6000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 6,000</span>
                                <span role="button" onClick={(e) => { handleActivePrice(10000); handleCheckList({ eventOwner: e, price: 10000 }) }} className={activePrice == '10000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 10,000</span>
                                <span role="button" onClick={(e) => { handleActivePrice(15000); handleCheckList({ eventOwner: e, price: 15000 }) }} className={activePrice == '15000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 15,000</span>
                                <span role="button" onClick={(e) => { handleActivePrice(20000); handleCheckList({ eventOwner: e, price: 20000 }) }} className={activePrice == '20000' ? 'active' : '' + "rangePrice d-block font-sm my-2"}>Starting From EGP 20,000</span>
                            </div>
                            <div className="rate-list my-4">
                                <ul className="p-0 m-0 list-unstyled">
                                    <li className={customRate == 5 ? 'active-rate' : null + "my-2"} onClick={() => { handleCustomRate(5) }} role="button">
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                    </li>
                                    <li className={customRate == 4 ? 'active-rate' : null + "my-2"} onClick={() => { handleCustomRate(4) }} role="button">
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star mx-1"></i>
                                    </li>
                                    <li className={customRate == 3 ? 'active-rate' : null + "my-2"} onClick={() => { handleCustomRate(3) }} role="button">
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                    </li>
                                    <li className={customRate == 2 ? 'active-rate' : null + "my-2"} onClick={() => { handleCustomRate(2) }} role="button">
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                    </li>
                                    <li className={customRate == 1 ? 'active-rate' : null + "my-2"} onClick={() => { handleCustomRate(1) }} role="button">
                                        <i className="fa-solid fa-star text-warning mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                        <i className="fa-solid fa-star  mx-1"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-9">
                        <div className="row">

                            <div className="sorted my-4">
                                <label className="me-3 fw-bolder font-sm" htmlFor="sort">Sort by:</label>
                                <select className="p-2 rounded font-sm fw-bolder bg-body-secondary" onChange={(e) => { handleCheckList({ sort: e.target.value }) }} name="sort" id="sort">
                                    <option value="undefind">Select</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                    <option value="ratingsAverage">Rating: Low to High</option>
                                    <option value="-ratingsAverage">Rating: High to Low</option>
                                </select>
                            </div>

                            {productsByRating.length !== 0 ? productsByRating.map((product) => {
                                return <div key={product.id} className="col-md-3 mb-5 product">
                                    <Link to={`/productDetails/${product.id}`}>
                                        <div>
                                            <img className="w-100" src={product.imageCover} alt="product" />
                                            <h6 className="fw-bold mt-3 font-sm text-main mb-0">{product.category.name}</h6>
                                            <p className="font-sm fw-bold  h-75px  mb-4 mt-1">{product.title.split(' ').slice(0, 12).join(' ')}</p>
                                            <div className="d-flex h-75px justify-content-between align-items-center py-3 overflow-hidden border-top border-1">
                                                <p className="fw-bold font-sm m-0">{product.priceAfterDiscount ? <> <span className="text-decoration-line-through">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</span> {product.priceAfterDiscount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })} </> : product.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</p>
                                                <p className="m-0"><span className="fw-bold font-sm">{product.ratingsQuantity}</span><i style={{ color: 'gold' }} className="px-1 fa-solid fa-star"></i>{product.ratingsAverage}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="d-flex align-items-center justify-content-between pb-5">
                                        <button onClick={() => {
                                            addProduct(product.id);

                                        }} className="btn bg-main text-white m-1 py-1 rounded">+</button>
                                        {localStorage.getItem('tkn') && WishListID.find((id) => { return id == product.id }) ? <i id={product.id} onClick={(e) => { addToWichList(product.id) }} className="fa-solid fa-heart text-danger fa-xl"></i> : <i id={product.id} onClick={(e) => { addToWichList(product.id) }} className="fa-regular fa-heart text-danger fa-xl"></i>}
                                    </div>
                                </div>
                            })
                                : <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
                                    <i className="fa-regular fa-face-rolling-eyes fa-7x"></i>
                                    <h5 className="fw-bolder my-4">No Available Items</h5>
                                </div>
                            }

                            <div className="parentOfPageNumBtns text-center mb-5">
                                {/* Buttons fetched and display here */}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </section >
}