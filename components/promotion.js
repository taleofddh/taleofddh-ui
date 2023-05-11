import React from 'react';
import Link from 'next/link';
import Slider from "react-slick";

function Promotion({ data }) {
    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: '0px'
    };

    return(
        <div className="promotionframe">
            <div className="promotiongroup">
                <Slider {...settings}>
                    {data.map((item, index) => (
                        <div key={index} className="promotion">
                            <Link href={item.link} as={item.link}>
                                <div className="promotionbanner" style ={{backgroundImage: 'url("/images/promotions/' + item.image + '")', backgroundPositionX: 'center',
                                    backgroundPositionY: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                                    <p className="promotiontitle">
                                        {item.title}
                                    </p>
                                    <p className="promotionblog">
                                        {item.tagLine}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default Promotion;