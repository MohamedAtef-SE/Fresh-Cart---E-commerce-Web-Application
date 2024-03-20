import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { cartContext } from "../Context/CartContext"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addressContext } from "../Context/Address";
import { authContext } from "../Context/AuthContextProvider";
import ShippingAddress from './../ShippingAddress/ShippingAddress';
import { Helmet } from "react-helmet";




export default function Payment() {


    const { cartID, setNumOfCartItems, setTotalCartPrice, setAllCartProducts, numOfCartItems, totalCartPrice } = useContext(cartContext);
    const { pickedAddress } = useContext(addressContext);
    const navigate = useNavigate();

    async function onlineOrder(cart_ID, data) {
        if (!data) {
            toast.error('Add Address', { position: 'top-center' });
            return;
        }
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart_ID}?`, data, {
            headers: {
                token: localStorage.getItem('tkn'),
            },

            params: {
                url: "https://MohamedAtef-SE.github.io/Fresh-Cart---E-commerce-Web-Application",
            }

        }
        )
            .then((response) => {
                console.log(response.data.session.client_reference_id);
                window.open(response.data.session.url, 'self');
            });

    }

    async function cashOrder(cart_ID, data) {

        if (!data) {
            toast.error('Add Address', { position: 'top-center' });
            return;
        }
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cart_ID}`,
            {
                shippingAddress: {
                    'details': data.details,
                    'phone': data.phone,
                    'city': data.city,
                },
            },
            {
                headers: {
                    token: localStorage.getItem('tkn'),
                }
            }

        ).then((res) => {
            toast.success('Payment Completed Successfully.', { position: 'top-center' });
            setAllCartProducts(null);
            setNumOfCartItems(0);
            setTotalCartPrice(0);
            setTimeout(() => { navigate('/home') }, 1500);


        }).catch((err) => {
            toast.error('Payment Error', { position: 'top-center' });
            console.log(err);
        }
        )

    }

    return <section className="paymentPage m-auto min-vh-100 bg-body-tertiary">

        <Helmet>
            <title>Payment Page</title>
        </Helmet>

        <div className="container shadow rounded p-5 my-5">
            <h2 className="fw-bolder my-4 text-center">Checkout</h2>

            <ShippingAddress />

            <div className="orderSum my-5 border-top border-1 py-4">
                <h5 className="fw-bolder">Order Summary</h5>
                <p className="font-sm fw-bolder">Items: {numOfCartItems}</p>
                <p className="font-sm fw-bolder">Total Price: EGP {totalCartPrice}</p>
                <button onClick={() => { cashOrder(cartID, pickedAddress) }} className="btn my-2 fw-bolder btn-warning w-100">Cash payment</button>
                <button onClick={() => { onlineOrder(cartID, pickedAddress) }} className="btn my-2 fw-bolder btn-warning w-100">Online payment</button>
            </div>
        </div>
    </section>
}