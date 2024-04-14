
import { Image, VStack, HStack, Center, Button, Text, Box } from '@chakra-ui/react'

function Output({ setLayout, outputImage }) {
    

    function handleRetake() {
        setLayout('Home');
    }

    function handleSave() {
        
    }

    return (
        <Center>
            <VStack justifyContent={'center'} height={'100vh'}>
                <Image src={`/images/logo_head.png`} alt='Logo' ml={30} mb={2}/>
                <Image src={outputImage} />
                <HStack justifyContent={'space-around'}>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleRetake} >Take New Image</Button>
                    <Button colorScheme='blue' fontSize={14} padding={6} w={380} onClick={handleSave} >Save To txt file</Button> 
                </HStack>
            </VStack>
        </Center>
    );
}

export default Output;