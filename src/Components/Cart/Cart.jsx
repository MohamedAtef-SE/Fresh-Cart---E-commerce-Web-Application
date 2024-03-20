import { useContext } from "react"
import { cartContext } from './../Context/CartContext';
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from './../LoadingPage/LoadingPage';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";



export default function Cart() {

    const { numOfCartItems, totalCartPrice, allCartProducts, updateCartPorduct, deleteCartProduct, clearCart, cartID } = useContext(cartContext);




    async function updateProduct(id, newCount) {

        await updateCartPorduct(id, newCount);
        if (updateCartPorduct) {
            console.log(cartID);
            toast.success('Product has been updated.', { position: "top-center" });
        }
        else {
            toast.error('Something Wrong.', { position: 'top-center' });
        }

    }

    async function myDelete(id) {
        const res = await deleteCartProduct(id);
        if (res) {
            toast.success('Deleted Successfully', { position: 'top-center' });
        }
        else {
            toast.error('Something Wrong', { position: 'top-center' });
        }

    }

    return <section className="cart min-vh-100">
        <Helmet>
            <title>Cart</title>
        </Helmet>

        <div className="container py-5">
            <h2 className="mb-2">Shopping Cart:</h2>
            <div className="d-flex justify-content-between">
                <p className="fs-6 text-main fw-bolder">Total Cart Price: {totalCartPrice.toLocaleString('en-US', { currency: 'EGP', style: 'currency' })}</p>
                <p className="fs-6 text-main fw-bolder">Total Cart Items: {numOfCartItems}</p>
                <button className="btn btn-danger" onClick={() => { clearCart() }}>Clear Cart</button>
                <Link to="/payment" className="btn btn-success">Proceed to Buy</Link>
            </div>


            {!allCartProducts ?

                <>
                    <div className="d-flex justify-content-center align-items-center vh-100" ><h1>Cart Empty</h1></div>

                </>

                : allCartProducts.map((product, idx) => {

                    return <div key={idx} className="row align-items-center my-3 py-3 border-bottom border-1">

                        <div className="col-2">
                            <div className="productImage">
                                <img className="w-100 h-200px" src={product.product.imageCover} alt="retail product" />
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="prodctData">
                                <h4 className="h6 border-bottom border-1 w-fit fw-bold">{product.product.brand.name}</h4>
                                <h5 className="my-3">{product.product.title}</h5>
                                <h6 className="my-3 ">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</h6>
                                <span onClick={() => { myDelete(product.product.id) }} role="button" ><i className="my-3 text-main fa-solid fa-trash"></i> Remove</span>
                            </div>
                        </div>
                        <div className="col-2 text-center">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <button onClick={() => { updateProduct(product.product.id, product.count + 1) }} className=" mx-2 btn-outline-success btn">+</button>
                                <span>{product.count}</span>
                                <button disabled={product.count == 1} onClick={() => { updateProduct(product.product.id, product.count - 1) }} className=" mx-2 btn-outline-success btn">-</button>
                            </div>
                        </div>
                    </div>
                })}
        </div>
    </section >
}