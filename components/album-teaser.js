import React from 'react';
import Link from 'next/link';
import ReactHtmlParser from 'html-react-parser';
import {marked} from 'marked';
import Title from './title';

// Public view of an album: cover, facts and description. Photos and videos are never part of it.
// The gated section (class photoalbumgated) is what the page's structured data marks as sign-in only.
function AlbumTeaser({name, teaser, authenticating, signInHref}) {
    const facts = teaser ? [
        teaser.dateLabel,
        teaser.locationLabel,
        teaser.photoCount ? teaser.photoCount + (teaser.photoCount === 1 ? ' photo' : ' photos') : null,
        teaser.videoCount ? teaser.videoCount + (teaser.videoCount === 1 ? ' video' : ' videos') : null
    ].filter(Boolean) : [];
    return (
        <div className="photoalbumframe">
            <Title message={name} />
            <ul className="photoalbumgroup">
                {teaser && (
                    <li className="photoalbumimagecontainer">
                        <div className="photoalbumimage">
                            <img src={teaser.coverUrl} alt={teaser.coverAlt || name + ' album cover'} />
                        </div>
                    </li>
                )}
                {teaser && (
                    <li className="photoalbumtextcontainer">
                        {facts.length > 0 && (
                            <div className="photoalbumdescription">
                                <p>{facts.join(' \u00b7 ')}</p>
                            </div>
                        )}
                        {teaser.description && (
                            <div className="photoalbumdescription">
                                {ReactHtmlParser(marked(teaser.description))}
                            </div>
                        )}
                    </li>
                )}
                <li className="photoalbumgallerycontainer photoalbumgated">
                    <div className="photoalbumdescription">
                        <p>The photos and videos in this album are for signed-in members.</p>
                        {!authenticating && (
                            <Link href={signInHref} className="btn photoalbumsignin">Sign in to view this album</Link>
                        )}
                    </div>
                </li>
            </ul>
        </div>
    )
}
export default AlbumTeaser;
