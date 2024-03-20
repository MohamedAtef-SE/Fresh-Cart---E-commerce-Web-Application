import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';


export default function Register() {

    const [successMeg, isSucceeded] = useState(false);
    const [alreadyExistMsg, isExist] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const userData = {
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phone: '',
    }

    const mySchema = Yup.object({
        name: Yup.string()
            .required('Full name is required')
            .matches(/^[a-zA-Z]+ [a-zA-Z]+$/, 'Invalid full name. Please enter both first and last names.')
            .min(3, 'minumum 3 letters.')
            .max(20, 'maximum 20 letters.'),

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

        rePassword: Yup.string()
            .required('Confirm your password')
            .oneOf([Yup.ref('password'), null], 'not match.'),

        phone: Yup.string()
            .matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian mobile number')
            .required('Mobile number is required'),
    }
    );


    const registerFormik = useFormik({

        initialValues: userData,

        validationSchema: mySchema,

        onSubmit: (values) => {
            setLoading(true);
            postDataToBackEnd(values);
        },

        // validate: (values) => {
        //     const errors = {};
        //     const nameRegex = /^[A-Z][a-z]{3,7}/;
        //     const passRegex = /[a-zA-Z]{6,10}/;
        //     const phoneRegex = /^[0-9]{8}$/;

        //     if (!nameRegex.test(values.name)) {

        //         errors.name = 'Name must contain at least one upper case, from 3 to 8 letters.';
        //     }
        //     if (!passRegex.test(values.password)) {

        //         errors.password = 'Password must contain at least one upper case, one number, from 8 to 20 chars.';
        //     }
        //     if (!phoneRegex.test(values.phone)) {

        //         errors.phone = 'Invaild phone number.';
        //     }
        //     if (values.password != values.rePassword) {

        //         errors.rePassword = 'Password not much.';
        //     }

        //     if (!values.email.includes('@') || !values.email.includes('.')) {

        //         errors.email = 'Invaild Email.';
        //     }
        //     return errors;
        // }


    })

    async function postDataToBackEnd(data) {

        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', data)
            .then((response) => {
                setLoading(false);

                isSucceeded(true);
                setTimeout(function () {
                    isSucceeded(false);
                    navigate('/login');
                }, 3000);

            })
            .catch((response) => {
                setLoading(false);
                isExist(response.response.data.message);
                setTimeout(function () {
                    isExist(undefined);
                }, 3000)
            });
    }


    return <>
        <section className="register-page bg-light p-5">

            <Helmet>
                <title>Register Form</title>
            </Helmet>

            <div className="container p-5">
                {successMeg ? <p className="alert alert-success">Greats Know you are one of our family member</p> : ''}
                {alreadyExistMsg ? <p className="alert alert-danger">{alreadyExistMsg}</p> : ''}
                <h2 className="text-capitalize fw-light mb-5">register now:</h2>

                <form onSubmit={registerFormik.handleSubmit}>
                    <div className="d-flex flex-column w-100 mb-3">
                        <label htmlFor="name">Name:</label>
                        <input onBlur={registerFormik.handleBlur} onChange={registerFormik.handleChange} value={registerFormik.values.name} type="text" className="form-control" id="name" name="name" />
                        {registerFormik.touched.name && registerFormik.errors.name ? <p className="alert alert-danger">{registerFormik.errors.name}</p> : ''}
                    </div>

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

                    <div className="d-flex flex-column w-100 mb-3">
                        <label htmlFor="rePassword">Re-Password:</label>
                        <input onBlur={registerFormik.handleBlur} onChange={registerFormik.handleChange} value={registerFormik.values.rePassword} type="password" className="form-control" id="rePassword" name="rePassword" />
                        {registerFormik.touched.rePassword && registerFormik.errors.rePassword ? <p className="alert alert-danger">{registerFormik.errors.rePassword}</p> : ''}
                    </div>

                    <div className="d-flex flex-column w-100 mb-3">
                        <label htmlFor="phone">Phone:</label>
                        <input onBlur={registerFormik.handleBlur} onChange={registerFormik.handleChange} value={registerFormik.values.phone} type="text" className="form-control" id="phone" name="phone" />
                        {registerFormik.touched.phone && registerFormik.errors.phone ? <p className="alert alert-danger">{registerFormik.errors.phone}</p> : ''}
                    </div>

                    <div className="w-100 text-end"><button type="submit" className="btn text-white bg-main">{loading ? <i className="fa-solid fa-spin fa-spinner"></i> : 'Submit'}</button></div>
                </form>
            </div>
        </section>
    </>;
};