import { Link, useNavigate } from "react-router-dom";
import logoImage from '../../Images/freshcart-logo.svg';
import { useContext, useState } from "react";
import { authContext } from "../Context/AuthContextProvider";
import { cartContext } from "../Context/CartContext";
import { wishContext } from "../Context/wishContext";
import { productsContext } from './../Context/AllProducts';



export default function Navbar() {

    const { tkn, tknFn, userData } = useContext(authContext);
    const navigate = useNavigate();
    const [active, setActive] = useState('home');

    const { numOfCartItems } = useContext(cartContext);
    const { numOfWishProducts } = useContext(wishContext);
    const { clearSavedFilter } = useContext(productsContext);

    function logout() {
        tknFn(null);
        localStorage.removeItem('tkn');
        clearSavedFilter();

        navigate('/login');
    }

    // document.querySelectorAll('.nav-link').forEach((gate) => {

    //     gate.addEventListener('click', function (e) {

    //         document.querySelectorAll('.nav-link').forEach((gate) => {
    //             gate.classList.remove('active');
    //         })

    //         e.target.classList.add('active');
    //     })
    // })


    return <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container d-flex justify-content-between w-100">
                <Link className="navbar-brand" to="/"><img src={logoImage} alt="Fresh Cart" /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse w-100" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item mx-2">
                            <Link onClick={() => { setActive('home') }} className={active === 'home' ? 'active' : null + "nav-link"} aria-current="page" to="/home">Home</Link>
                        </li>
                        <li className="nav-item mx-2">
                            <Link onClick={() => { setActive('cat') }} className={active === 'cat' ? 'active' : null + "nav-link"} aria-current="page" to="/categories">Categories</Link>
                        </li>
                        <li className="nav-item mx-2">
                            <Link onClick={() => { setActive('brand') }} className={active === 'brand' ? 'active' : null + "nav-link"} aria-current="page" to="/brands">Brands</Link>
                        </li>
                    </ul>

                    <ul className="list-unstyled p-0 m-0 d-flex flex-wrap ms-auto align-items-center">
                        {tkn ? <>
                            <li className="mx-3">
                                <Link className="position-relative py-2" to="/cart">
                                    {numOfCartItems !== 0 ? <i className="fa-solid text-main fa-cart-shopping"></i> : <i className="fa-solid fa-cart-shopping"></i>}
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-main">
                                        {numOfCartItems != 0 ? numOfCartItems : ''}
                                    </span>
                                </Link>
                            </li>
                            <li className="mx-3">
                                <Link className="position-relative py-2" to="/wish_list">
                                    {numOfWishProducts == 0 ? <i className="fa-regular text-danger fa-heart"></i> : <i className="fa-solid text-danger fa-heart"></i>}
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-main">
                                        {numOfWishProducts != 0 ? numOfWishProducts : ''}
                                    </span>
                                </Link>
                            </li>
                            {tkn ? <li className="mx-3">
                                <Link className="position-relative py-2" to="/profile">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <i className="fa-solid fa-user fa-lg p-0 m-0"></i> <h6 className="m-0 text-capitalize fw-bolder font-sm mx-1">{userData.name}</h6>
                                    </div>
                                </Link>
                            </li> : ''}
                        </> : ''}
                        {tkn ? <li><span onClick={logout} role="button" className="my-1 fw-bolder text-decoration-underline mx-1">Logout</span></li> : <><li><Link role="button" className="my-1 fw-bolder text-decoration-underline mx-1" to="/register">Register</Link></li>
                            <li><Link role="button" className="my-1 fw-bolder text-decoration-underline mx-1" to="/login">Login</Link></li></>}
                    </ul>
                </div>
            </div>
        </nav>

    </>

}