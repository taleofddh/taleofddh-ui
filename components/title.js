import React  from 'react';

function Title({message, icon, index}) {
    let title;
    if(icon) {
        title =
            <>
                {message} <img src={"/images/" + icon} alt={icon} />
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