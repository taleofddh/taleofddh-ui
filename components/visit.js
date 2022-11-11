import React, {useState, useEffect} from 'react';
import Map from "./map";

function Visit({data}) {
    const[mapColor, setMapColor] = useState({});

    useEffect(() => {
        let colors = mapColor;
        for(let i in data) {
            for(let j in data[i].countries) {
                colors[data[i].countries[j].countryCode] = data[i].backgroundColor;
            }
        }
        setMapColor(mapColor => ({...mapColor, colors}));
    }, [mapColor, data])

    return (
        <div>
            <Map visitData={data} mapColor={mapColor}/>
            <ul className="visitstatusgroup">
                {data.map((item, index) => (
                    <li key={index} className="visitstatusitem"  style={{color: item.color, backgroundColor: item.backgroundColor}}>
                        <p className="visitstatustitle">{item.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Visit;