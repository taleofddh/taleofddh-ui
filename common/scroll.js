import React, { useEffect, Fragment } from 'react';

function ScrollToTop({ history, children }) {
    useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        }
    }, []);

    return <Fragment>{children}</Fragment>;
}

export default ScrollToTop;