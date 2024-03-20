import { useContext, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from './../LoadingPage/LoadingPage';
import { cartContext } from './../Context/CartContext';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";





export default function AllOrders() {
    const { addProductToCart } = useContext(cartContext);
    const userID = localStorage.getItem('userID');
    useEffect(() => {

        getAllOrders();

    }, [])

    const { data, isLoading } = useQuery({ queryKey: ['getOrders'], queryFn: getAllOrders });

    async function getAllOrders() {

        return axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userID}`);
    }


    function addProduct(id) {
        const added = addProductToCart(id);
        if (added) {
            toast.success('Addedd Successfully.', { position: 'top-center' });
        }
        else {
            toast.error('Something Wrong.', { position: 'top-center' });
        }
    }



    if (isLoading) {
        return <LoadingPage />
    }

    return <section className="allorders min-vh-100">

        <Helmet>
            <title>All Orders</title>
        </Helmet>


        <div className="container-fluid bg-body-tertiary p-5">
            <h2 className="my-5 border-bottom border-1">Your Orders</h2>
            <h5 className="my-2">{data.data.length} orders placed</h5>
            {data.data.map((order) => {
                return <div className="row my-5 rounded bg-white rounded-top border border-1">
                    <div className="col-2">
                        <div className="box p-4">
                            <p className="fw-bold font-sm my-2">ORDER PLACED</p>
                            <p className="fw-bold font-sm my-2">{order.createdAt.slice(0, 10)}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box p-4">
                            <h6 className="fw-bold font-sm my-2">TOTAL</h6>
                            <p className="fw-bold font-sm my-2">EGP {order.totalOrderPrice}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box p-4">
                            <h6 className="fw-bold font-sm my-2">SHIP TO</h6>
                            <p className="fw-bold font-sm my-2">{order.user.name}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box p-4">
                            <h6 className="fw-bold font-sm my-2">Payment Method</h6>
                            <p className="fw-bold font-sm my-2">{order.paymentMethodType}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box p-4">
                            <h6 className="fw-bold font-sm my-2">{order.isPaid ? 'paid' : 'Not paid yet'}</h6>
                            <h6 className="fw-bold font-sm my-2">{order.isDelivered ? 'Delivered' : 'Not delivered yet'}</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box p-4">
                            <h6 className="fw-bold font-sm my-2">ORDER #{order.id}</h6>
                        </div>
                    </div>
                    <div className="col-12 bg-body-tertiary rounded-bottom border border-1">
                        <h6 className="fw-bolder m-5">Number of cart Items: {order.cartItems.length}</h6>
                        {order.cartItems.map((product) => {
                            return <div className="row m-5 align-items-center">

                                <div className="col-2">
                                    <div className="box text-center">
                                        <h6 className="mb-2 fw-bold">Count: {product.count}</h6>
                                        <img className="w-100" src={product.product.imageCover} alt={product.product.title} />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="box">
                                        <h6 className="fw-bolder fs-6">{product.product.brand.name}</h6>
                                        <h6 className="fw-bolder fs-6">{product.product.category.name}</h6>
                                        <h6>{product.product.title}</h6>
                                        <h6>{product.product.ratingsAverage} <i className="fa-solid fa-start text-gold"></i></h6>
                                        <h6>Price: EGP {product.price}</h6>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="box">
                                        <button onClick={() => { addProduct(product.product.id) }} className="btn btn-warning">Buy it again</button>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
    </section>

}