import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
// import { Area } from '@ant-design/plots';

import dynamic from 'next/dynamic'

const {Area} = dynamic(() => import('@ant-design/plots'), {
  ssr: false,
});

export const MonthlyEmailSend = (props) => {
    
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/360c3eae-0c73-46f0-a982-4746a6095010.json')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
            console.log('fetch data failed', error);
        });
    };
    const config = {
        data,
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {
        range: [0, 1],
        },
    };

    return <Area {...config} />;


}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyEmailSend)