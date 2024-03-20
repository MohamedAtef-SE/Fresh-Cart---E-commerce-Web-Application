import { createHashRouter, RouterProvider } from 'react-router-dom';
import LayOut from '../LayOut/LayOut';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Home from '../Home/Home';
import Categories from '../Categories/Categories';
import Cart from '../Cart/Cart';
import Brands from '../Brands/Brands';
import ProductDetails from '../ProductDetails/ProductDetails';
import Protected from '../Protected/Protected';
import AuthContextProvider from '../Context/AuthContextProvider';
import AllProductsProvider from '../Context/AllProducts';
import CartContextProvider from '../Context/CartContext';
import errorImage from '../../Images/error.svg';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import WishContextProvider from '../Context/wishContext';
import WishList from '../WishList/WishList';
import Payment from '../Payment/Payment';
import ForgetPassword from '../ForgetPassword/ForgetPassword';
import AllOrders from '../AllOrders/AllOrders';
import Profile from '../Profile/Profile';
import { Offline } from 'react-detect-offline';
import AddressProvider from '../Context/Address';
import SpecBrand from './../SpecBrand/SpecBrand';
import SpecCat from './../SpecCat/SpecCat';


const myRoute = createHashRouter(
  [
    {
      path: '/', element: <LayOut />, children: [
        { index: true, element: <Home /> },
        { path: '/home', element: <Home /> },
        { path: '/productDetails/:id', element: <ProductDetails /> },
        { path: '/cart', element: <Protected> <Cart /> </Protected> },
        { path: '/profile', element: <Protected> <Profile /> </Protected> },
        { path: '/wish_list', element: <Protected> <WishList /> </Protected> },
        { path: '/categories', element: <Categories /> },
        { path: '/categories/:id', element: <SpecCat /> },
        { path: '/brands/', element: <Brands /> },
        { path: '/brands/:id', element: <SpecBrand /> },
        { path: '/payment', element: <Protected> <Payment /> </Protected> },
        { path: '//allorders', element: <Protected> <AllOrders /> </Protected> },
        { path: '/register', element: <Register /> },
        { path: '/login', element: <Login /> },
        { path: '/forget_password', element: <ForgetPassword /> },
        { path: '*', element: <div className='w-100 text-center'><img className='w-100 vh-notFound' src={errorImage} alt="4 0 4 Page Not Found" /></div> }
      ]
    },
  ]
);



export default function App() {


  //& react-query handle asyc state
  const myClient = new QueryClient();

  return <QueryClientProvider client={myClient}>

    <AuthContextProvider>

      <AddressProvider>

        <AllProductsProvider>

          <WishContextProvider>

            <CartContextProvider>


              <RouterProvider router={myRoute} />
              <Toaster />
              <Offline>
                <div className="bg-black fixed-bottom text-white p-2 m-0">
                  <p className='p-0 m-0'>Your internet connection has been lost ....</p>
                </div>
              </Offline>



            </CartContextProvider>

          </WishContextProvider>

        </AllProductsProvider>

      </AddressProvider>

    </AuthContextProvider>

  </QueryClientProvider>
}