import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingPage from './../LoadingPage/LoadingPage';
import { cartContext } from "../Context/CartContext";
import toast from "react-hot-toast";
import { wishContext } from './../Context/wishContext';


export default function SpecCat() {

    const { id } = useParams();

    const { addProductToCart } = useContext(cartContext);

    const { handleWishlistToggle, WishListID } = useContext(wishContext);



    async function getSpecCat() {

        return await axios.get(`https://ecommerce.routemisr.com/api/v1/products/?category=${id}`)
    }



    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['specCat'],
        queryFn: getSpecCat,
        gcTime: 60000,
    });


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


    async function addToWichList(id) {

        if (localStorage.getItem('tkn')) {
            handleWishlistToggle(id);
        }
        else {
            toast.error('Login First', { position: 'top-center' });
        }
    }


    if (isLoading || isFetching) {
        return <LoadingPage />
    }


    return <section className="specCat p-5 min-vh-100">

        <div className="container">
            {data.data.data.length !== 0 ? <div className="row">
                {data.data.data.map((product) => {
                    return <div key={product.id} className="col-md-2 mb-5 product">
                        <Link to={`/productDetails/${product.id}`}>

                            <div>
                                <img className="w-100" src={product.imageCover} alt="product" />
                                <h6 className="fw-bold mt-3 font-sm text-main mb-0">{product.category.name}</h6>
                                <h6 className="fw-bold mt-3 font-sm text-main mb-0">{product.brand.name}</h6>
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
            </div> :
                <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
                    <i className="fa-regular fa-face-rolling-eyes fa-7x"></i>
                    <h5 className="fw-bolder my-4">No Available Items</h5>
                </div>}
        </div>
    </section >
}
