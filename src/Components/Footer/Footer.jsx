import logo from '../../Images/freshcart-logo.svg'


export default function Footer() {


    return <section className="py-3 text-center bg-body-tertiary">
        <img src={logo} alt="logo" />
        <h6 className='my-3 fw-bolder font-sm'>&copy; Mohamed Atef - 2024</h6>
        <ul className="list-unstyled m-0 d-flex align-items-center justify-content-center">
            <li className="mx-3"><i className="fa-brands fa-facebook"></i></li>
            <li className="mx-3"><i className="fa-brands fa-youtube"></i></li>
            <li className="mx-3"><i className="fa-brands fa-instagram"></i></li>
            <li className="mx-3"><i className="fa-brands fa-twitter"></i></li>
        </ul>
    </section>
}