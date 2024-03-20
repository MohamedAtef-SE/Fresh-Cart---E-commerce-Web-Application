import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App/App";
import axios from "axios";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
)