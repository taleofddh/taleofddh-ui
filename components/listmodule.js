import React from 'react';
import Link from "next/link";
import Image from "next/image";

function ListModule({source, path, list}) {
    return (
        <ul className="listmodulegroup">
            {list.map((item, index) => (
                <li key={index} className="listmoduleitem">
                    <Link href={'/' + source + (path ? '/' + path.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() : '') + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()} as={'/' + source + (path ? '/' + path.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() : '') + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()}>
                        <span>
                            <div className="listmoduleimage">
                                <Image src={item.signedUrl} alt={item.name + '.jpg'} width={360} height={360} />
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