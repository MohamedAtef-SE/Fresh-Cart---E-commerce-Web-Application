import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom"
import LoadingPage from "../LoadingPage/LoadingPage";
import Categories from './../Categories/Categories';
import { useContext } from "react";
import { cartContext } from "../Context/CartContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";



export default function ProductDetails() {
    const { id } = useParams();
    const { addProductToCart } = useContext(cartContext);

    async function addProduct(id) {
        if (localStorage.getItem('tkn')) {
            const res = await addProductToCart(id);

            if (res) {
                toast.success('data added successfully', { duration: 1500, position: "top-center" });
            }
            else {
                toast.error('something wrong, please try again', { duration: 1500, position: "top-center" });
            }
        }
        else {
            toast.error('Login First', { position: 'top-center' });
        }
    }

    function getDetails() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    }

    const { data, isError, isFetching, isLoading } = useQuery({
        queryKey: [`productDetails-${id}`],
        queryFn: getDetails,
    })

    if (isLoading) {
        return <LoadingPage />
    }
    if (isError) {
        return <Navigate to='*' />
    }

    function displayMe(src) {

        document.querySelector('.mainImage img').setAttribute('src', src);
    }


    return (
        <section className="proDetails">
            <Helmet>
                <title>{data.data.data.title}</title>
            </Helmet>

            <div className="continer p-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="images">
                            <div className="row align-items-center g-1">
                                <div className="col-2">
                                    <div className="small-img">
                                        {data.data.data.images[0] ? <img onMouseEnter={(e) => { displayMe(e.target.src) }} className="w-100" src={data.data.data.images[0]} alt="image of product" /> : ''}
                                    </div>

                                    <div className="small-img">
                                        {data.data.data.images[1] ? <img onMouseEnter={(e) => { displayMe(e.target.src) }} className="w-100" src={data.data.data.images[1]} alt="image of product" /> : ''}
                                    </div>

                                    <div className="small-img">
                                        {data.data.data.images[2] ? <img onMouseEnter={(e) => { displayMe(e.target.src) }} className="w-100" src={data.data.data.images[2]} alt="image of product" /> : ''}
                                    </div>

                                    <div className="small-img">
                                        {data.data.data.images[3] ? <img onMouseEnter={(e) => { displayMe(e.target.src) }} className="w-100" src={data.data.data.images[3]} alt="image of product" /> : ''}
                                    </div>
                                </div>

                                <div className="col-10">

                                    <div className="mainImage">
                                        <img className="w-100" src={data.data.data.images[0]} alt="Master Product Image" />
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="details">
                            <h2 className="h4 mb-4 fw-bold">{data.data.data.title}</h2>
                            <p className="p-3 text-secondary">{data.data.data.description}</p>
                            <h6 className="text-main fw-bolder font-sm">{data.data.data.category.name}</h6>
                            <div className="d-flex mb-3 justify-content-between">
                                {data.data.data.priceAfterDiscount ? <p><span className=" text-decoration-line-through">{data?.data.data.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</span> - {data?.data.data.priceAfterDiscount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</p> : <p> {data?.data.data.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</p>}
                                <p><span className="fw-bold font-sm">{data.data.data.ratingsQuantity}</span> <i style={{ color: 'gold' }} className="fa-solid fa-star"></i>  {data.data.data.ratingsAverage}</p>
                            </div>
                            <button onClick={() => {
                                addProduct(id);
                            }} className="bg-main btn w-100 text-white fw-bold">add to cart</button>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}