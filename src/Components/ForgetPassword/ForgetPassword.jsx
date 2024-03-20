import axios from "axios"
import { useFormik } from "formik"
import { useState } from "react"
import { Helmet } from "react-helmet"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"




export default function ForgetPassword() {

    const [verifyForm, setVerifyForm] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const navigate = useNavigate();

    const resetFormik = useFormik({

        initialValues: {

            "email": "",
            "newPassword": ""
        },

        onSubmit: (values) => {

            axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', values)
                .then((response) => {
                    toast.success('Password reseted successfully.', { position: 'top-center' });

                    setTimeout(() => {

                        navigate('/login');

                    }, 1500);

                })
                .catch((err) => {
                    console.log(err)
                    toast.error('Something Wrong. Try Again', { position: 'top-center' });

                })
        }
    })

    const verifyFormik = useFormik({

        initialValues: {

            "resetCode": "",
        },

        onSubmit: (values) => {
            console.log(values);
            axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', values)
                .then((response) => {
                    toast.success('Now you can reset your password', { position: 'top-center' });

                    setTimeout(() => {

                        setResetForm(true);

                    }, 1500);

                })
                .catch((err) => {

                    toast.error('Invalid verifcation code', { position: 'top-center' });

                })
        }
    })



    const mailFormik = useFormik({

        initialValues: {

            "email": "",
        },

        onSubmit: (values) => {

            axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', values)
                .then((response) => {
                    toast.success(response.data.message, { position: 'top-center' });
                    setVerifyForm(true);
                })
                .catch((err) => {
                    toast.error(err.response.data.message, { position: 'top-center' });
                    console.log('Forget Password Error: ', err);
                })
        }
    })

    return <section className="forgetPass vh-100 d-flex justify-content-center align-items-center bg-body-tertiary">

        <Helmet>
            <title>Forget Password</title>
        </Helmet>

        <div className="container bg-white shadow rounded p-4 w-50">
            <form onSubmit={mailFormik.handleSubmit}>
                <label className="fw-bold my-2" htmlFor="email">Email:</label>
                <input id="email" onChange={mailFormik.handleChange} value={mailFormik.values.email} className="form-control" type="text" />
                <div className="w-100 text-end">
                    <button type="submit" className="btn btn-dark my-4">Submit</button>
                </div>
            </form>

            {verifyForm ? <form onSubmit={verifyFormik.handleSubmit}>

                <input placeholder="6-digits" onChange={verifyFormik.handleChange} value={verifyFormik.values.resetCode} id="resetCode" className="form-control w-25" type="text" />
                <button type="submit" className="btn btn-dark my-3">Verify</button>
            </form> : ''}
            {resetForm ? <form onSubmit={resetFormik.handleSubmit}>

                <input placeholder="Email Address" onChange={resetFormik.handleChange} value={resetFormik.values.email} id="email" className="form-control my-3" type="text" />
                <input placeholder="New Password" onChange={resetFormik.handleChange} value={resetFormik.values.newPassword} id="newPassword" className="form-control my-3" type="password" />
                <button type="submit" className="btn btn-dark my-3">Reset</button>
            </form> : ''}

        </div>
    </section>
}