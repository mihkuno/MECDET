import { Image, VStack, Center, Button, Text, Input } from '@chakra-ui/react';
import { useState } from 'react';

function Home({ setLayout, setOutputImage }) {
    
    function handleCapture() {
        setLayout('Capture');
    }

    function handleUpload(event) {
        const image = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const src = reader.result;
            setOutputImage(src);
            setLayout('Output');
        };

        if (image) {
            reader.readAsDataURL(image);
        }
    };

    return (
        <Center>
            <VStack justifyContent={'center'} height={'100vh'}>
                <Image src={`/images/logo_main.png`} alt='Logo'/>
                <VStack marginTop={100}>
                    {/* Input component for file selection */}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        display="none" // Hide the input field
                        id="image-input"
                    />
                    {/* Button to trigger file input */}
                    <label htmlFor="image-input">
                        <Button as="span" colorScheme="blue" fontSize={14} padding={6} w={380}>
                            Upload Medicine Image
                        </Button>
                    </label>
                    <Text fontWeight={'bold'} m={'auto'} my={8}>or</Text>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleCapture}>Capture Medicine Image</Button> 
                </VStack>
            </VStack>
        </Center>
    );
}

export default Home;
