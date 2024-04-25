import Tesseract from 'tesseract.js';
import React, { useRef, useState, useEffect } from 'react';
import { FilesetResolver, ImageClassifier } from "@mediapipe/tasks-vision";
import { Image, VStack, HStack, Center, Button, Text, Box } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

import {
    Ascozin, Bioflu, Biogesic, Bonamine, Buscopan, DayZinc, Decolgen, Flanax, Imodium, Lactezin, Lagundi, Midol, Myra_E, Neurogen_E, Omeprazole, Rinityn, Rogin_E, Sinecod, Tempra, Tuseran
} from '../components/Description';

function Output({ setLayout, outputImage }) {
    
    const imageRef = useRef(null);
    const [reader, setReader] = useState('');    
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (imageRef.current === null) return;


        async function recognizeText() {
            const result = await Tesseract.recognize(imageRef.current);
        
            // Set the minimum confidence score threshold
            const confidenceThreshold = 70; // Adjust this threshold as needed
        
            const filteredText = result.data.words
                .filter(word => word.confidence > confidenceThreshold)
                .map(word => word.text)
                .join(' ');
        
            console.log("Filtered Text:", filteredText);
            setReader(filteredText);
        }
        
        recognizeText();
        

        async function createImageClassifier() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            const imageClassifier = await ImageClassifier.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `/exported_model/model.tflite`
                },
            });

            const output = imageClassifier.classify(imageRef.current);

            console.log(output);

            const result = output.classifications[0].categories.slice(0, 5).map(item => ({
                score: (item.score * 100).toFixed(2) + "%",
                categoryName: item.categoryName
            }));

            setResult(result);
        }
        
        createImageClassifier();

    }, [imageRef]);

    function handleRetake() {
        setLayout('Home');
    }

    function handleSave() {
        if (result.length === 0) {
            console.log("No result to save.");
            return;
        }

        const textToSave = result.map(item => `${item.categoryName}: ${item.score}`).join('\n');
        const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'result.txt');
    }

    return (
        <>
        
        <Center>
            <Box>
                <Center><Image src={`/images/logo_head.png`} alt='Logo' ml={30} mb={2}/></Center>
                

                {
                    result.length > 0 && 
                    <Box textAlign={'right'} float={'right'} mr={-150} mt={50}>
                        {result.map((item, index) => (
                            <Text key={index} fontSize={'20'}>{item.categoryName + ':\t ' + item.score}</Text>
                        ))}

                    </Box>
                }
                
                
                <Center><Image ref={imageRef} src={outputImage} width={640} border={'4px solid black'}/></Center>

            
                
                {
                    reader !== '' && <Center><Text fontSize={15} m={1} maxW={750}>{reader}</Text></Center>
                }   
                <Center>
                    <HStack justifyContent={'space-around'}>
                        <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleRetake} >Take New Image</Button>
                        <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleSave} >Save To txt file</Button> 
                    </HStack>
                </Center>
            

                <Box py={20} maxW={800}>
                    {result.length > 0 && result[0].categoryName === 'Ascozin' && <Ascozin />}
                    {result.length > 0 && result[0].categoryName === 'Bioflu' && <Bioflu />}
                    {result.length > 0 && result[0].categoryName === 'Biogesic' && <Biogesic />}
                    {result.length > 0 && result[0].categoryName === 'Bonamine' && <Bonamine />}
                    {result.length > 0 && result[0].categoryName === 'Buscopan' && <Buscopan />}
                    {result.length > 0 && result[0].categoryName === 'DayZinc' && <DayZinc />}
                    {result.length > 0 && result[0].categoryName === 'Decolgen' && <Decolgen />}
                    {result.length > 0 && result[0].categoryName === 'Flanax' && <Flanax />}
                    {result.length > 0 && result[0].categoryName === 'Imodium' && <Imodium />}
                    {result.length > 0 && result[0].categoryName === 'Lactezin' && <Lactezin />}
                    {result.length > 0 && result[0].categoryName === 'Lagundi' && <Lagundi />}
                    {result.length > 0 && result[0].categoryName === 'Midol' && <Midol />}
                    {result.length > 0 && result[0].categoryName === 'Myra_E' && <Myra_E />}
                    {result.length > 0 && result[0].categoryName === 'Neurogen_E' && <Neurogen_E />}
                    {result.length > 0 && result[0].categoryName === 'Omeprazole' && <Omeprazole />}
                    {result.length > 0 && result[0].categoryName === 'Rinityn' && <Rinityn />}
                    {result.length > 0 && result[0].categoryName === 'Rogin_E' && <Rogin_E />}
                    {result.length > 0 && result[0].categoryName === 'Sinecod' && <Sinecod />}
                    {result.length > 0 && result[0].categoryName === 'Tempra' && <Tempra />}
                    {result.length > 0 && result[0].categoryName === 'Tuseran' && <Tuseran />}
                </Box>
            </Box>
        </Center>

        </>   
    );
}

export default Output;
