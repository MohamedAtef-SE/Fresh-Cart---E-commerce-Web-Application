
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';


export default function LayOut() {



    return <section className='container-fluid'>
        <Navbar />
        <Outlet />
        <Footer />
    </section>
}