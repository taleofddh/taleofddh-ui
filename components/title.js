import React  from 'react';
import Image from 'next/image';

function Title({message, icon, index}) {
    let title;
    if(icon) {
        title =
            <>
                {message} <Image src={"/images/" + icon} alt={icon} layout='responsive' width='100%' height='100%' />
            </>
    } else {
        title =
            <>
                {message.toUpperCase()}
            </>
    }

    return (
        <p key={index} className="titleholder">
            <label className="title">{title}</label>
        </p>
    )
}

export default Title;