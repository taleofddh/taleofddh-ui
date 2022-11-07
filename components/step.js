import React from 'react';
import Steps, { Step } from 'rc-steps';

const description = '';

function CustomStep({steps, current}) {
    return (
        <Steps current={current} labelPlacement='vertical'>
            {steps.map((item, index) => (
                <Step key={index} title={item.title} description={item.description} icon={item.icon} />
            ))}
        </Steps>
    )
}

export default CustomStep;