import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { cartContext } from "../Context/CartContext"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addressContext } from "../Context/Address";
import { authContext } from "../Context/AuthContextProvider";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Helmet } from "react-helmet";


export default function ShippingAddress() {

    const { userData, getUserData } = useContext(authContext);
    const { addAddress, allAddress, getLoggedUserAddress, removeAddress, setPickedAddress } = useContext(addressContext);


    useEffect(() => {
        getLoggedUserAddress();
    }, []);

    async function removeThisAddress(add_id) {

        const response = await removeAddress(add_id);

        if (response.status == "success") {

            toast.success(response.message, { position: 'top-center' });

        }
        else {

            toast.error('Something Wrong', { position: "top-center" });
        }

    }

    let shippingAddress = {

        'name': '',

        "details": "",

        "phone": "",

        "city": "",
    }

    const mySchema = Yup.object({

        "details": Yup.string('required').required('Details Required'),

        "phone": Yup.string()
            .matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian mobile number')
            .required('Mobile number is required'),

        "city": Yup.string('required').required('City is Required'),

    })

    async function mySubmit(values, { resetForm }) {

        const response = await addAddress(values);

        if (response.status == 'success') {
            toast.success(response.message, { position: 'top-center' });
        }
        else {
            toast.error(response.data.message, { position: 'top-center' });
        }
        resetForm();

    }

    const paymentFormik = useFormik({

        initialValues: shippingAddress,

        validationSchema: mySchema,

        onSubmit: mySubmit,

    })


    function displayModal() {

        document.querySelector('.newAddressModal').classList.toggle('d-none');
    }

    return <>
        <h5 className="fw-bolder my-4">Shipping Address</h5>

        <div className="row">
            <div className="col-md-6">
                <div className="d-flex flex-wrap justify-content-start my-5 align-items-center">
                    {allAddress ? allAddress.map((address) => {
                        return <div key={address._id} className="d-flex position-relative m-2 justify-content-start align-items-center rounded bg-black text-white p-4 bg-opacity-50">
                            <i onClick={() => { removeThisAddress(address._id) }} role="button" className="fa-solid fa-xmark position-absolute top-0 end-0 m-3"></i>
                            <input onChange={() => { setPickedAddress({ details: address.details, phone: address.phone, city: address.city }) }} type="radio" name="address" id="address" />
                            <label className="ms-3" htmlFor="address">
                                <h6 className="my-2 fw-bolder">{address.name} </h6>
                                <h6 className="my-2"><span className="fw-bolder">Details:</span> {address.details}</h6>
                                <h6 className="my-2"><span className="fw-bolder">Phone:</span> {address.phone}</h6>
                                <h6 className="my-2"><span className="fw-bolder">City:</span> {address.city}</h6>
                            </label>
                        </div>
                    }) :
                        <div className="d-flex w-100 align-items-center justify-content-center">
                            <h2 className="fst-italic ">No address added yet !!</h2>

                        </div>}
                </div>
            </div>
            <div className="col-md-6">
                <div onClick={displayModal} className="addAddressCard rounded m-5 p-5 border border-2 shadow d-flex flex-column justify-content-center align-items-center">
                    <i className="fa-solid fa-plus fa-2x text-main"></i>
                    <h6>Add New Address</h6>
                </div>
            </div>
        </div>


        <div className="newAddressModal shadow d-none d-flex justify-content-center align-items-center position-fixed top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50">
            <div className="box position-relative bg-white p-5 rounded w-75">
                <i onClick={displayModal} role="button" className="fa-solid fa-xmark fa-2x position-absolute top-0 end-0 p-4"></i>
                <h5 className="fw-bold my-4">Add new address:</h5>
                <form onSubmit={paymentFormik.handleSubmit}>
                    <div className="d-flex my-3 w-100 align-items-center justify-content-between">
                        <label className="fw-bold pe-3" htmlFor="userName">Name:</label>
                        <input onChange={paymentFormik.handleChange} onBlur={paymentFormik.handleBlur} value={userData ? paymentFormik.values.name = userData.name : paymentFormik.values.name} id="userName" name="userName" className="form-control" type="text" />

                    </div>
                    <div className="d-flex my-3 w-100 align-items-center justify-content-between">
                        <label className="fw-bold pe-3" htmlFor="details">Details:</label>
                        <input onChange={paymentFormik.handleChange} onBlur={paymentFormik.handleBlur} value={paymentFormik.values.details} id="details" name="details" className="form-control" type="text" />
                        {paymentFormik.touched.details && paymentFormik.errors.details ? <p className="alert alert-danger">{paymentFormik.errors.details}</p> : ''}
                    </div>
                    <div className="d-flex my-3 w-100 align-items-center justify-content-between">
                        <label className="fw-bold pe-3" htmlFor="phone">Phone:</label>
                        <input onChange={paymentFormik.handleChange} onBlur={paymentFormik.handleBlur} value={paymentFormik.values.phone} id="phone" name="phone" className="form-control" type="text" />
                        {paymentFormik.touched.phone && paymentFormik.errors.phone ? <p className="alert alert-danger">{paymentFormik.errors.phone}</p> : ''}
                    </div>
                    <div className="d-flex my-3 w-100 align-items-center justify-content-between">
                        <label className="fw-bold pe-3" htmlFor="details">City:</label>
                        <input onChange={paymentFormik.handleChange} onBlur={paymentFormik.handleBlur} value={paymentFormik.values.city} id="city" name="city" className="form-control" type="text" />
                        {paymentFormik.touched.city && paymentFormik.errors.city ? <p className="alert alert-danger">{paymentFormik.errors.city}</p> : ''}
                    </div>
                    <div className="text-end">
                        <button onClick={displayModal} type="submit" className="btn btn-success">Add New Address</button>
                    </div>
                </form>
            </div>
        </div>
    </>
}