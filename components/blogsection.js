import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {MEDIA_HOST} from "../common/constants";

function BlogSection({ category, blogs }) {

    return (
        <>
            <div className="blogsectionheader">{category + ' Blogs'}</div>
            <ul className="blogsectiongroup">
                {blogs.map((item, index) => (
                    <li key={index} className="blogsectionitem">
                        <div className="blogsectiontitle">
                            {item.header}
                        </div>
                        <div className="blogsectionpiccontrol">
                            <Link href={item.link + '/' + item.category + '/' + item.name} as={item.link + '/' + item.category + '/' + item.name}>
                                <Image src={MEDIA_HOST + '/images/mobile/' + item.titlePhoto} alt={item.titlePhoto} layout='responsive' width={3} height={2}/>
                            </Link>
                        </div>
                        <div className="blogsectiontext">
                            {item.summary}&nbsp;
                            <Link href={item.link + '/' + item.category + '/' + item.name} as={item.link + '/' + item.category + '/' + item.name}>...Read More</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default BlogSection;