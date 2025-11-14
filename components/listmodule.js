import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {MEDIA_HOST_PUBLIC} from "../common/constants";

function ListModule({source, path, list}) {
    return (
        <ul className="listmodulegroup">
            {list.map((item, index) => (
                <li key={index} className="listmoduleitem">
                    <Link href={'/' + source + (path ? '/' + path.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() : '') + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()} as={'/' + source + (path ? '/' + path.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() : '') + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()}>
                        <span>
                            <div className="listmoduleimage">
                                {/*<div style={{display: "block", overflow: "hidden", position: "relative", boxSizing: "border-box", margin: "0px"}}>*/}
                                    {/*<div style={{display: "block", boxSizing: "border-box", paddingTop: "120%"}}></div>*/}
                                    <img src={item.signedUrl} alt={item.name + '.jpg'}  width={1} height={1}/>
                                {/*</div>*/}
                            </div>
                            <div className="listmoduletitle">
                                <p style={{margin: '0px'}}>{item.name}</p>
                            </div>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default ListModule;