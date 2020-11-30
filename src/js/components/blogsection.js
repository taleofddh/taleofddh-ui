import React from 'react';
import '../../scss/components/blogsection.scss';
import {MEDIA_HOST} from "../common/constants";

function BlogSection(props) {

    return (
        <>
            <div className="blogsectionheader">Travel Blogs</div>
            <ul className="blogsectiongroup">
                <li className="blogsectionitem">
                    <p className="blogsectionpiccontrol">
                        <img src={MEDIA_HOST + '/images/mobile/vacation/asia/india/ganapatipule/ganapatipule-17.jpg'} />
                    </p>
                    <p className="blogsectiontext">
                        Ganapatipule is a small village on the Konkan coast with a series of beautiful beaches. Even after staying more than 10 years in Mumbai and hearing a lot about this magnificent place we have never been to Ganapatipule till the winter of 2009.
                        Extending the weekend by a day we planned for a short trip and booked an overnight bus from Borivali. About 375 km south of Mumbai it took the entire night of half sleep half awake in an air conditioned coach to reach Ratnagiri.
                        &nbsp;<a href="#">...Read More</a>
                    </p>

                </li>
                <li className="blogsectionitem">
                    <p className="blogsectionpiccontrol">
                        <img src={MEDIA_HOST + '/images/mobile/day-outing/europe/england/lulworth/lulworth-03.jpg'} />
                    </p>
                    <p className="blogsectiontext">
                        One of our collegues gave overwhelming feedback of some wonders of Jurassic Coast, a World Heritage Site on the English Channel coast of southern England. So one Saturday morning in summer of 2008 we boarded the South Western bound train to Weymouth.
                        The major challenge was to explain the ticket master where to get down for 'Lulworth'. After my several attempts she failed to understand what I said and I had to write it down for her (A genuine communication problem that too in Great Britain).
                        &nbsp;<a href="#">...Read More</a>
                    </p>

                </li>
                <li className="blogsectionitem">
                    <p className="blogsectionpiccontrol">
                        <img src={MEDIA_HOST + '/images/mobile/vacation/africa/south-africa/cape-town/cape-town-24.jpg'} />
                    </p>
                    <p className="blogsectiontext">
                        Cape Town - arguably the most visited tourist attraction in South Africa was next in our destination list from Johannesburg. The second largest city in the country and is the capital of the Western Cape Province, as well as Cape Town is the legislative capital of South Africa.
                        After a 2 hour flight we arrived Cape Town in the morning of 1st of December 2008 and picked up our rental car from SIXT. The car was the same Nissan Tida like last time with the only variation in color (RED).
                        &nbsp;<a href="#">...Read More</a>
                    </p>
                </li>
            </ul>
        </>
    )
}

export default BlogSection;