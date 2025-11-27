import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import nasaClient from "../utils/nasaClient";

export default function Busca({onBuscaRealizada}) {
    const [termoBuscado, setTermoBuscado] = useState("")

    const buscar = () => {
        onBuscaRealizada(termoBuscado); // chama função do App
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={termoBuscado}
                onChangeText={setTermoBuscado}
                style={styles.input}
                placeholder='Digite o que deseja buscar (Ex: moon, earth...)'
            />
            <Pressable
                onPress={buscar}
                style={styles.button}>
                <Text style={styles.buttonText}>Buscar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 12,
        textAlign: 'center',
        borderRadius: 4
    },
    button: {
        width: '100%',
        backgroundColor: '#0096F3',
        padding: 12,
        borderRadius: 4,
        marginBottom: 20
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});