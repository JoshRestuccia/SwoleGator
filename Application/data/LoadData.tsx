import React, { useState, useEffect } from 'react';

export type VictoryData = {
    x: number,
    y: number,
    l: string
};

export type Datapoint = {
    x_data: VictoryData,
    y_data: VictoryData,
    z_data: VictoryData
};

// Not sure why but localhost has to be the IP address of the machine serving api.py
const localhost = 'http://192.168.0.19';
const port = '3000';
const api_route = '/api/getdata';

export default function getData(dir: string): VictoryData[] | undefined{

    const [jsonData, setJsonData] = useState<Array<Datapoint>>([]);
    const [xData, setXData] = useState<Array<VictoryData>>([]);
    const [yData, setYData] = useState<Array<VictoryData>>([]);
    const [zData, setZData] = useState<Array<VictoryData>>([]);

    const parseAxesData = () => {
        //console.log(jsonData);
        switch(dir){
            case 'x':
                const xarray = new Array(jsonData.length);
                console.log('[parseAxesData] Pushing X Data to xarray...')
                for(let i = 0; i < jsonData.length; i++){
                    xarray.push(jsonData[i].x_data);
                }
                setXData(xarray);
            case 'y':
                const yarray = new Array<VictoryData>(jsonData.length);
                console.log('[parseAxesData] Pushing Y Data to yarray...')
                for(let i = 0; i < jsonData.length; i++){
                    yarray.push(jsonData[i].y_data);
                }
                setYData(yarray);
            case 'z':
                const zarray = new Array<VictoryData>(jsonData.length);
                console.log('[parseAxesData] Pushing Z Data to zarray...')
                for(let i = 0; i < jsonData.length; i++){
                    zarray.push(jsonData[i].z_data);
                }
                setZData(zarray);
        }
    };

    useEffect(() => {
        const url = `${localhost}:${port}${api_route}`;
        console.log(`FETCHING DATA FROM URL(${url})`);
        fetch(url)
        .then(resp => resp.json())
        .then(data => setJsonData(data.datapoints))
        .catch(err => console.error(err)); 
        
        parseAxesData();
        // Get new data every x seconds
        /*const x = 5 * 1000;
        const dataInterval = setInterval(() => fetchData(url), x);
        return () => clearInterval(dataInterval);*/
    }, []);
    switch(dir){
        case 'x':
            return xData;
        case 'y':
            return yData;
        case 'z':
            return zData;
    }
}

export {getData};