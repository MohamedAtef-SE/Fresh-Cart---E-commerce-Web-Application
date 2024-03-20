import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingPage from '../LoadingPage/LoadingPage';
import { useContext } from "react";
import { productsContext } from "../Context/AllProducts";
import { Helmet } from "react-helmet";

export default function Brands() {

    const { getBrands } = useContext(productsContext);
    const { data, isLoading } = useQuery({ queryKey: ['findBrands'], queryFn: getBrands });


    if (isLoading) {

        return <LoadingPage />
    }

    return <section className="brands">
        <Helmet>
            <title>Brands</title>
        </Helmet>

        <div className="container py-5">
            <div className="row">
                {data.data.data.map((brand) => {
                    return <div key={brand._id} className="col-md-3">
                        <Link to={`/brands/${brand._id}`}>
                            <div className="content m-4">
                                <img className="w-100 h-200px rounded shadow" src={brand.image} alt={brand.name} />
                                <h5 className="fw-bolder text-center py-3 text-capitalize">{brand.name}</h5>
                            </div>
                        </Link>
                    </div>
                })}
            </div>
        </div>
    </section>
}