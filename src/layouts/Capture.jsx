

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Image, VStack, HStack, Center, Button, Text, Spacer } from '@chakra-ui/react'

function Capture({ setLayout, setOutputImage }) {
    const cameraRef = useRef(null);

    function handleBack() {
        setLayout('Home');
    }

    function handleCapture() {
        const src = cameraRef.current.getScreenshot();
        setOutputImage(src);
        setLayout('Output');
    }

    return (
        <Center>
            <VStack justifyContent={'center'} height={'100vh'}>
                <Image src={`/images/logo_head.png`} alt='Logo' ml={30} mb={2}/>
                <Webcam ref={cameraRef} audio={false} mirrored={false} screenshotFormat='image/jpeg' width={'100%'} />
                <HStack justifyContent={'space-around'} >
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleBack} >Go Back</Button>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleCapture} >Capture</Button> 
                </HStack>
            </VStack>
        </Center>
    );
}

export default Capture;