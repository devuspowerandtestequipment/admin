import React,{useEffect,useState} from 'react'
import { connect } from 'react-redux'
// import { Area } from '@ant-design/plots';

// const {Area} = dynamic(() => import('@ant-design/plots'), {
//   ssr: false,
// });

import dynamic from 'next/dynamic'
const Area = dynamic(() => import('@ant-design/plots').then(({ Area }) => Area),
    { ssr: false }
);

export const MonthlyPageVisit = (props) => {
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     // asyncFetch();
    //     setData(props.data)
    // }, [props]);

    // const asyncFetch = () => {
    //     fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
    //     .then((response) => response.json())
    //     .then((json) => setData(json))
    //     .catch((error) => {
    //         console.log('fetch data failed', error);
    //     });
    // };

    const data=props.data;

    const config = {
        data,
        xField: '_id',
        yField: 'Total',
        xAxis: {
        range: [0, 1],
        tickCount: 8,
        },
        areaStyle: () => {
        return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        };
        },
    };

    return(
        <>
        <Area {...config} />
        <center>
            <br />
            <p>Last 7 days page visit</p>
        </center>
        </>
    )
    
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyPageVisit)