import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi, useFetch} from '../common/hook'
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/termsandcondition.scss';

const pagetitle = 'Terms & Conditions';
const source = 'terms-conditions';

function TermsAndConditions(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = useFetch(
        api + '/core/termsAndConditionsList'
    );

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="termsandconditionsframe">
                        <Title message={pagetitle} />
                        <div className="termcontainer">
                            {loading ? (
                                <Loader loading={loading} />
                            ) : (
                                <>
                                    {data.map((item, index) => {
                                        return (
                                            <Terms key={index} term={item} />
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Terms(props) {
    let data = props.term.content;
    let termdetails = data.map((item, index) => {
        return (
            <Term key={index} content={item} />
        )
    });
    return (
        <div key={props.term.id} className="term">
            <p>
                <label className="termheader">
                    {props.term.header}
                </label>
            </p>
            {termdetails}
        </div>
    )
}

function Term(props) {
    return (
        <p key={props.seq}>
            <label className="termdescription">
                {props.content}
            </label>
        </p>
    )
}

export default TermsAndConditions;