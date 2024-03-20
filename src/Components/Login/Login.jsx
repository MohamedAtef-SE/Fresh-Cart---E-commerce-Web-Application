import axios from "axios";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { authContext } from "../Context/AuthContextProvider";
import { addressContext } from "../Context/Address";
import { Helmet } from "react-helmet";



export default function Login() {

    const [successMeg, isSucceeded] = useState(false);
    const [alreadyExistMsg, isExist] = useState(undefined);
    const [loading, setLoading] = useState(false);



    const { tknFn, getUserData } = useContext(authContext);
    const { getLoggedUserAddress } = useContext(addressContext);

    const userData = {

        email: '',
        password: '',

    }

    const navigate = useNavigate();
    const mySchema = Yup.object({

        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),

        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(/[A-Z]/, 'At least 1 uppercase letter is required')
            .matches(/[0-9]/, 'At least 1 number is required')
            .matches(/[!@#$_%^&*(),.?":{}|<>]/, 'At least 1 special character is required'),


    }
    );

    async function postDataToBackEnd(data) {
        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', data)
            .then((response) => {

                isSucceeded(true);
                setTimeout(function () {
                    isSucceeded(false);
                    navigate('/home');
                }, 3000);

                setLoading(false);

                localStorage.setItem('tkn', response.data.token);
                tknFn(response.data.token);
                getUserData();
                getLoggedUserAddress();

            })
            .catch((response) => {

                isExist(response.response.data.message);
                setTimeout(function () {
                    isExist(undefined);
                }, 3000)
                setLoading(false);
            });
    }

    const registerFormik = useFormik({

        initialValues: userData,

        validationSchema: mySchema,

        onSubmit: (values) => {

            setLoading(true);
            postDataToBackEnd(values);
        },

    })
    return <>
        <section className="register-page bg-light p-5">

            <Helmet>
                <title>Login Page</title>
            </Helmet>

            <div className="container p-5">
                {successMeg ? <p className="alert alert-success">HOME SWEET HOME</p> : ''}
                {alreadyExistMsg ? <p className="alert alert-danger">{alreadyExistMsg}</p> : ''}
                <h2 className="text-capitalize fw-light mb-5">Login:</h2>

                <form onSubmit={registerFormik.handleSubmit}>


                    <div className="d-flex flex-column w-100 mb-3">
                        <label htmlFor="email">Email:</label>
                        <input onBlur={registerFormik.handleBlur} onChange={registerFormik.handleChange} value={registerFormik.values.email} type="email" className="form-control" id="email" name="email" />
                        {registerFormik.touched.email && registerFormik.errors.email ? <p className="alert alert-danger">{registerFormik.errors.email}</p> : ''}
                    </div>

                    <div className="d-flex flex-column w-100 mb-3">
                        <label htmlFor="password">Password:</label>
                        <input onBlur={registerFormik.handleBlur} onChange={registerFormik.handleChange} value={registerFormik.values.password} type="password" className="form-control" id="password" name="password" />
                        {registerFormik.touched.password && registerFormik.errors.password ? <p className="alert alert-danger">{registerFormik.errors.password}</p> : ''}
                    </div>
                    <div className="w-100 text-end">
                        <button type="submit" className="btn text-white bg-main">{loading ? <i className="fa-solid fa-spin fa-spinner"></i> : 'Login'}</button>
                    </div>
                </form>
                <div className="w-100 text-end">
                    <Link to='/forget_password' role="button" className="text-danger fw-bolder d-block mt-3">Forget Password</Link>
                </div>
            </div>
        </section>
    </>;
};