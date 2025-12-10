import React from 'react';
import {MEDIA_PROTECTED_HOST} from "../common/constants";
import {yearFormatToString} from "../common/common";

function Family({ source, path, type, family }) {
    return (
            <ul className="familygroup">
                <li className="familyimagecontainer" style={{cursor: 'auto'}}>
                    <div className="familyimage">
                        <img src={MEDIA_PROTECTED_HOST + '/images/org/' + type.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() + '/' + family.image} alt={family.image} />
                    </div>
                </li>
                <li className="familytextcontainer" style={{cursor: 'auto'}}>
                    <div className="familytext">
                        <p>
                            <span style={{fontWeight: 'bold'}}>Member Code:</span> {family.communityCode}
                        </p>
                        <p>
                            <span style={{fontWeight: 'bold'}}>Short Name:</span> {family.shortName}
                        </p>
                        <p>
                            <span style={{fontWeight: 'bold'}}>Member Since:</span> {yearFormatToString(new Date(family.memberSince))}
                        </p>
                        <p><span style={{fontWeight: 'bold'}}>Member Name(s):</span></p>
                        {family.members.map((item, index) => (
                            <p key={index}>
                                {item.name}
                            </p>
                        ))}

                    </div>
                </li>
            </ul>
    )
}

export default Family;