import { useContext } from "react"
import { authContext } from "../Context/AuthContextProvider"
import LoadingPage from './../LoadingPage/LoadingPage';
import AllOrders from "../AllOrders/AllOrders";
import ShippingAddress from "../ShippingAddress/ShippingAddress";
import { Helmet } from "react-helmet";

export default function Profile() {


    const { userData } = useContext(authContext);

    if (!userData) {
        return <LoadingPage />;
    }


    return <section className="profile min-vh-100 bg-body-tertiary">

        <Helmet>
            <title>{userData.name}'s Profile</title>
        </Helmet>

        <div className="container-fluid p-5 my-5">
            <h5 className="fw-bolder ">Hello, {userData.name}</h5>

            <ShippingAddress />
            <AllOrders />

        </div>

    </section>
}