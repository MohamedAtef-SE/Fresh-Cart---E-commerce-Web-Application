import { useQuery } from "@tanstack/react-query";
import axios, { all } from "axios";
import { useContext, useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom";
import LoadingPage from './../LoadingPage/LoadingPage';
import { productsContext } from "../Context/AllProducts";
import { Helmet } from "react-helmet";

export default function Categories() {

    const { getCategories } = useContext(productsContext);


    const { data, isLoading } = useQuery({ queryKey: ['findCategories'], queryFn: getCategories });

    if (isLoading) {

        return <LoadingPage />
    }

    return <section className="categories">
        <Helmet>
            <title>Categories</title>
        </Helmet>
        <div className="container py-5">
            <div className="row">
                {data.data.data.map((category) => {
                    return <div key={category._id} className="col-md-3">
                        <Link to={`/categories/${category._id}`}>
                            <div className="content m-4">
                                <img className="w-100 h-200px rounded shadow" src={category.image} alt={category.name} />
                                <h5 className="fw-bolder text-center py-3 text-capitalize">{category.name}</h5>
                            </div>
                        </Link>
                    </div>
                })}
            </div>
        </div>
    </section>
}