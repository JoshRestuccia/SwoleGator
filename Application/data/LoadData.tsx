
import React, { useState, useEffect } from 'react';
import Data from './examples/victory-ex1.json';

const getData = (dir: string) => {

    const [jsonData, setJsonData] = useState(Data);

    useEffect(() => {
        try{
            setJsonData(Data); 
                   
        }catch(error){
            console.error(`[fetchData] Could not fetch data from the datafile`);
        }
    }, []);

    switch(dir){
        case 'x':
            console.debug(`[getData] Retrieving X_DATA = ${JSON.stringify(jsonData.x_data)}`);
            return jsonData.x_data;
        case 'y':
            console.debug(`[getData] Retrieving Y_DATA = ${JSON.stringify(jsonData.y_data)}`);
            return jsonData.y_data; 
        case 'z':
            console.debug(`[getData] Retrieving Z_DATA = ${JSON.stringify(jsonData.z_data)}`);
            return jsonData.z_data;
    }
}

export {getData};