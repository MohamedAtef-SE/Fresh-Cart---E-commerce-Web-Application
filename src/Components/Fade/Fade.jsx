import React from "react";
import Slider from "react-slick";
import image_1 from '../../Images/image_01.jpg';
import image_2 from '../../Images/image_02.jpg';
import image_3 from '../../Images/image_03.jpg';

function Fade() {
    const settings = {
        dots: false,
        fade: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: true
    };
    return (
        <section className="container-fluid">
            <div className="slider-container">
                <Slider {...settings}>
                    <div>
                        <img className="w-100 vh-50-navbar" src={image_1} />
                    </div>
                    <div>
                        <img className="w-100 vh-50-navbar" src={image_2} />
                    </div>
                    <div>
                        <img className="w-100 vh-50-navbar" src={image_3} />
                    </div>
                </Slider>
            </div>
        </section>
    );
}

export default Fade;
