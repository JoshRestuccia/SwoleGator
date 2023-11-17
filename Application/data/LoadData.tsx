
import React, { useState, useEffect } from 'react';
import Data from './examples/victory-ex1.json';

const getData = () => {

    const [jsonData, setJsonData] = useState(Data);

    useEffect(() => {
        try{
            setJsonData(Data);
            console.log(JSON.stringify(jsonData));
        }catch(error){
            console.error(`[fetchData] Could not fetch data from the datafile`);
        }
    }, []);

    return (
        jsonData
    );
}

export {getData};