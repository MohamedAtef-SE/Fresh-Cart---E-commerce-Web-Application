import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingPage from './../LoadingPage/LoadingPage';
import { cartContext } from "../Context/CartContext";
import toast from "react-hot-toast";
import { productsContext } from "../Context/AllProducts";
import { wishContext } from './../Context/wishContext';
import Slider from "react-slick";
import { Helmet } from "react-helmet";


export default function Home() {

    const { addProductToCart } = useContext(cartContext);

    const { handleWishlistToggle, WishListID } = useContext(wishContext);

    const { getAllProducts } = useContext(productsContext);

    const [customRate, setCustomRate] = useState(0);

    const { data: dataAllProducts, isLoading: loadingAllProducts, refetch } = useQuery({
        queryKey: ['allProducts'],
        queryFn: getAllProducts,
        gcTime: 60000,
    });


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

    const { getCategories, getBrands, setBrandID, brandID, setCatID, catID, rangePrice, setRangePrice, sortBy, setSortBy, getTopThree } = useContext(productsContext);

    const { data: dataAllCategories, isLoading: loadingAllCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: getCategories,
    });

    const { data: topThree, isLoading: topThreeLoading } = useQuery({ queryKey: ['topThree'], queryFn: getTopThree });


    const { data: dataAllBrands, isLoading: loadingAllBrands } = useQuery({
        queryKey: ['allBrands'],
        queryFn: getBrands,
    });


    function handleCheckList({ eventOwner, cat, brand, price, sort }) {
        if (cat !== undefined) {

            if (cat.id !== catID) {
                setCatID(cat.id);
            }
            else if (cat.id === catID) {
                cat.checked = false;
                setCatID(undefined);
            }

        }

        if (brand !== undefined) {

            if (brand.id !== brandID) {
                setBrandID(brand.id);
            }

            else if (brand.id === brandID) {
                brand.checked = false;
                setBrandID(undefined);
            }

        }

        if (price !== undefined) {

            setRangePrice(price);
            document.querySelectorAll('.rangePrice').forEach((rangePrice) => {
                rangePrice.addEventListener('click', function (e) {
                    document.querySelectorAll('.rangePrice').forEach((rangePrice) => {
                        rangePrice.classList.remove('active');
                    })
                    e.target.classList.add('active');
                })
            })

        }

        if (sort !== sortBy) {
            setSortBy(sort);
        }

        setTimeout(() => { refetch() }, [1000]);
    }

    //========= END SIDE BAR============//

    if (loadingAllProducts || loadingAllBrands || loadingAllCategories || topThreeLoading) {
        return <LoadingPage />
    }

    const productsByRating = dataAllProducts.data.data.filter((product) => { return product.ratingsAverage >= customRate });
    //const productsByPrice = productsByRating.filter((product) => { return product.price >= min && product.price <= max });


    //==================== START Slick-Slider ====================//

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 4000,
        cssEase: "linear"
    };

    //==================== END Slick-Slider ====================//


    return <section className="home position-relative">
        <Helmet>
            <title>Home Page</title>
        </Helmet>

        <div className="container">


            <div className="Head-part vh-75 rounded shadow my-5 border-1 p-5 bg-body-secondary container">
                <h4 className="fw-bolder mb-3">Most Sold Products</h4>
                <div className="slider-container">
                    <Slider {...settings}>

                        {topThree.data.data.map((product) => {
                            return <div key={product.id} className="rounded product">
                                <Link to={`/productDetails/${product.id}`}>
                                    <div className="p-2 rounded bg-white mx-1">
                                        <img className="w-100 rounded" src={product.imageCover} alt="product" />
                                        <div className="h-75px">
                                            <h6 className="fw-bold my-2 font-sm text-main">{product.category.name}</h6>
                                            <p className="font-sm my-2 fw-bold">{product.title.split(' ').slice(0, 4).join(' ')}</p>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        })
                        }
                    </Slider>
                </div>

            </div>

            <div className="row">
                <div className="col-3">
                    <div className="box bg-body-tertiary min-vh-100 p-3 ">
                        <div className="cat-list my-4">
                            <h6 className="fw-bolder">Categories</h6>
                            <ul className="list-unstyled p-0 m-0">
                                {dataAllCategories.data.data.map((category) => {
                                    return <li key={category._id}>
                                        <input onClick={(e) => { handleCheckList({ cat: e.target }) }} name="category" type="radio" id={category._id} value={category.name} />
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
                                        <input onClick={(e) => { handleCheckList({ brand: e.target }) }} type="radio" name="brand" id={brand._id} value={brand.name} />
                                        <label className="ms-2 font-sm" htmlFor={brand._id}>{brand.name}</label>
                                    </li>
                                })}
                            </ul>
                        </div>
                        <div className="price-range my-4">
                            <h6 className="fw-bolder font-sm">Price</h6>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 1000 }) }} className="rangePrice d-block font-sm my-2">Starting From EGP 1,000</span>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 3000 }) }} className="rangePrice d-block font-sm  my-2">Starting From EGP 3,000</span>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 6000 }) }} className="rangePrice d-block font-sm  my-2">Starting From EGP 6,000</span>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 10000 }) }} className="rangePrice d-block  font-sm my-2">Starting From EGP 10,000</span>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 15000 }) }} className="rangePrice d-block  font-sm my-2">Starting From EGP 15,000</span>
                            <span role="button" onClick={(e) => { handleCheckList({ eventOwner: e, price: 20000 }) }} className="rangePrice d-block  font-sm my-2">Starting From EGP 20,000</span>
                        </div>
                        <div className="rate-list my-4">
                            <ul className="p-0 m-0 list-unstyled">
                                <li className="my-2" onClick={() => { setCustomRate(5) }} role="button">
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                </li>
                                <li className="my-2" onClick={() => { setCustomRate(4) }} role="button">
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star mx-1"></i>
                                </li>
                                <li className="my-2" onClick={() => { setCustomRate(3) }} role="button">
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star  mx-1"></i>
                                    <i className="fa-solid fa-star  mx-1"></i>
                                </li>
                                <li className="my-2" onClick={() => { setCustomRate(2) }} role="button">
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star text-warning mx-1"></i>
                                    <i className="fa-solid fa-star  mx-1"></i>
                                    <i className="fa-solid fa-star  mx-1"></i>
                                    <i className="fa-solid fa-star  mx-1"></i>
                                </li>
                                <li className="my-2" onClick={() => { setCustomRate(1) }} role="button">
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

                        {productsByRating.map((product) => {
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
                                    {localStorage.getItem('tkn') && WishListID.find((id) => { return id == product.id }) ? <i id={product.id} onClick={(e) => { addToWichList(product.id) }} className="fa-solid fa-heart text-danger fa-xl"></i> : <i id={product.id} onClick={(e) => { addToWichList(product.id) }} className="fa-solid fa-heart text-dark fa-xl"></i>}
                                </div>
                            </div>
                        })
                        }
                    </div>
                </div>
            </div>
        </div>

    </section >
}