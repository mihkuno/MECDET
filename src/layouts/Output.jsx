import React, { useRef, useState, useEffect } from 'react';
import { FilesetResolver, ImageClassifier } from "@mediapipe/tasks-vision";
import { Image, VStack, HStack, Center, Button, Text, Box } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

function Output({ setLayout, outputImage }) {
    
    const imageRef = useRef(null);
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (imageRef.current === null) return;

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
        <Center>
            {
                result.length > 0 && 
                <Box textAlign={'right'}>
                    {result.map((item, index) => (
                        <Text key={index} fontSize={'20'}>{item.categoryName + ':\t ' + item.score}</Text>
                    ))}
                </Box>
            }
            <VStack justifyContent={'center'} height={'100vh'}>
                <Image src={`/images/logo_head.png`} alt='Logo' ml={30} mb={2}/>
                <Image ref={imageRef} src={outputImage} width={640}/>
                <HStack justifyContent={'space-around'}>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleRetake} >Take New Image</Button>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleSave} >Save To txt file</Button> 
                </HStack>
            </VStack>
        </Center>
    );
}

export default Output;
