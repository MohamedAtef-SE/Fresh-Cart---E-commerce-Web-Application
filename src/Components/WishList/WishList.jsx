import { useContext } from "react"
import { wishContext } from "../Context/wishContext"
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import Brands from './../Brands/Brands';
import { Helmet } from 'react-helmet';


export default function WishList() {

    const { getWishList, allWishList, numOfWishProducts, handleWishlistToggle } = useContext(wishContext);

    const { isLoading, data } = useQuery({ queryKey: ['getWishList'], queryFn: getWishList });

    if (isLoading) {

        return <LoadingPage />
    }


    return <section className="wishList py-5 min-vh-100">

        <Helmet>
            <title>Wish List</title>
        </Helmet>

        <div className="container">
            <h3 className="mb-4">Wish list:</h3>
            <h6 className="fw-bolder">Number Of Items: {numOfWishProducts}</h6>
            {allWishList.length > 0 ? allWishList.map((product) => {
                return <div key={product.id} className="container">
                    <div className="row align-items-center m-0 py-4 border-bottom border-1">
                        <div className="col-2">
                            <div className="content">
                                <img className="w-100" src={product.imageCover} alt={product.title} />
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="content">
                                <h5 className="fw-bolder my-3">{product.brand.name}</h5>
                                <h5 className="my-3">{product.category.name}</h5>
                                <h6 className="my-3 fw-bolder">{product.title}</h6>
                                <h6 className="my-3">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</h6>
                                {product.quantity > 0 ? <h6 className="text-success fw-bolder">in-Stock</h6> : <h6 className="text-danger">Out Of Stock</h6>}
                                {product.ratingsAverage ? <h6 className="text-success fw-bolder my-3">{product.ratingsAverage} <i className="fa-solid fa-star text-warning"></i> <span className="fw-light">{product.ratingsQuantity}</span></h6> : ''}
                            </div>
                        </div>
                        <div className="col-2">
                            <i onClick={() => { handleWishlistToggle(product.id) }} className="fa-solid fa-heart text-danger fa-xl"></i>
                        </div>
                    </div>
                </div>

            }) : <div className="d-flex vh-100 justify-content-center align-items-center"><h2> <i className="fa-solid fa-heart-broken"></i>  Wish list is Empty</h2></div>}
        </div>
    </section>
}