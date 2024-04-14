import React, { useState, useRef, useEffect } from 'react';
import wikipedia from 'wikipedia';
import Webcam from 'react-webcam';
import BarChart from './utils/BarChart';
import { TypeAnimation } from 'react-type-animation';
import { Heading, Button, Container, Flex, Card } from '@chakra-ui/react';
import { FilesetResolver, ImageClassifier } from "@mediapipe/tasks-vision";
import { useLayoutEffect } from 'react';

const App = () => {
    const cameraRef                             = useRef(null);
    const [showCamera,      setShowCamera]      = useState(false);
    const [imageClassifier, setImageClassifier] = useState(null);
    const [searchKeyword,   setSearchKeyword]   = useState(null);
    const [searchResults,   setSearchResults]   = useState(null);
    
    
    const [data, setData] = useState([
        { name: 'x', value: 0 },
        { name: 'x', value: 0 },
        { name: 'x', value: 0 },
        { name: 'x', value: 0 },
        { name: 'x', value: 0 },
    ]);

    const startCamera = () => setShowCamera(true);
    const stopCamera = () => setShowCamera(false);

    async function search(keyword) {
        try {
            const page = await wikipedia.page(keyword);
            const summary = (await page.summary()).extract
            setSearchKeyword(keyword);
            setSearchResults(summary);
        } 
        catch (error) {
            console.error('Error fetching search results:', error);
        } 
    };


    /**
     * Real-time classification of video stream
     * @param {*} stream 
     */
    function handleStream(stream) {

        // bug fix when camera is unmounted
        if (!cameraRef.current) return; 

        let lastVideoTime = -1;
        const video = cameraRef.current.video;

        function renderLoop() {

            // bug fix when camera is unmounted
           if (!cameraRef.current) return;

            const isNextBuffer  = video.readyState === 4;
            const hasNextBuffer = video.currentTime !== lastVideoTime; 
            
            if (showCamera && isNextBuffer && hasNextBuffer) {
                let output = imageClassifier.classifyForVideo( video, performance.now() );

                // get the category and predictions
                output = output.classifications[0].categories;

                // sort by prediction score
                output.sort((a, b) => b.score - a.score);
                
                // get the required data properties
                output = output.map(e => ({ name: e.categoryName, value: e.score }));

                // set as new data
                setData(output);

                lastVideoTime = video.currentTime;     
            }  

            // callback to run function at each new frame
            // requestAnimationFrame(() => renderLoop() );
            
            // or do, recursive timeout for 300ms
            setTimeout(renderLoop, 300);
        } 
        renderLoop();
    }

           
    async function initializeClassifier() {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const classifier = await ImageClassifier.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "/exported_model/model.tflite"
            },
            maxResults: 5,
            runningMode: 'VIDEO'
        });
        setImageClassifier(classifier);
    }

    useLayoutEffect(() => {initializeClassifier()}, []);

    useEffect(() => {
        // ignore if same keyword
        if (searchKeyword === data[0].name) {
            return;
        }
        // search if the first class' score is more than 40%.
        else if (data[0].value > 0.4) {
            search(data[0].name); 
        }
        // erase the search if all results are less than 10%
        else if (data[0].score <= 0.1) {
            setSearchResults(null); 
        }
    }, [data]);


    return (
        <Container maxW={'1000px'}>
            <Card>
                <Flex margin={20} justifyContent={'center'}>
                    <Container>
                    { imageClassifier 
                        ?   <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                <Heading>What Medicine Is This?</Heading>
                                <BarChart data={data} />
                                {!showCamera 
                                    ?   <Button variant={'solid'} colorScheme={'blue'} width={'100%'} margin={5} onClick={startCamera}>Start Camera</Button>
                                    :   <>
                                            <Button variant={'outline'} colorScheme={'blue'} width={'100%'} margin={5} onClick={stopCamera}>Stop Camera</Button>
                                            <Webcam ref={cameraRef} /> { /* onLoadedData={handleStream} real-time classification */ }
                                        </>
                                }
                                { searchResults && 
                                    <TypeAnimation 
                                        key={searchResults} // Add key prop here
                                        sequence={[searchResults]} 
                                        speed={95} 
                                        style={{ padding: 5, marginTop: 15, fontFamily: '"Lucida Console", "Courier New", monospace'}} 
                                    />
                                }
                            </Flex>
                        :   <Heading>Loading Model...</Heading>
                    }
                    </Container>
                </Flex>
            </Card>
        </Container>
    );
};

export default App;






