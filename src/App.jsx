import React, { useState } from 'react';
import Home    from './layouts/Home';
import Capture from './layouts/Capture';
import Output  from './layouts/Output';

function App() {

    const [outputImage, setOutputImage] = useState('');
    const [layout, setLayout] = useState('Home');

    return (
        <>
            { layout === 'Home'    && <Home    setLayout={setLayout} setOutputImage={setOutputImage} /> }
            { layout === 'Capture' && <Capture setLayout={setLayout} setOutputImage={setOutputImage} /> }
            { layout === 'Output'  && <Output  setLayout={setLayout} outputImage={outputImage}  /> }
        </>
    );
}

export default App;
