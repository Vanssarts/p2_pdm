import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Busca({ onBuscaRealizada }) {
  const [termoBuscado, setTermoBuscado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState(null);

  const anos = [2020, 2021, 2022, 2023, 2024, 2025];

  const buscar = () => {
    onBuscaRealizada(termoBuscado, anoSelecionado);
  };

  return (
    <View style={styles.container}>

      <TextInput
        value={termoBuscado}
        onChangeText={setTermoBuscado}
        style={styles.input}
        placeholder='Digite o que deseja buscar (Ex: moon, earth...)'
      />

      <View style={styles.anosContainer}>
        {anos.map((ano) => (
          <Pressable
            key={ano}
            onPress={() => setAnoSelecionado(ano)}
            style={[
              styles.anoButton,
              anoSelecionado === ano ? styles.anoButtonSelecionado : {}
            ]}
          >
            <Text
              style={[
                styles.anoText,
                anoSelecionado === ano ? styles.anoTextSelecionado : {}
              ]}
            >
              {ano}
            </Text>
          </Pressable>
        ))}
      </View>

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
    marginTop: 10,
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
  anosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 12,
    gap: 4,
  },
  anoButton: {
  borderWidth: 1,
  borderColor: '#999',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginVertical: 6,
  marginHorizontal: 4,
  width: 90, // largura fixa para alinhar
  alignItems: 'center',
  },
  anoButtonSelecionado: {
    backgroundColor: '#0096F3',
    borderColor: '#0096F3',
  },
  anoText: {
  color: '#000',
  fontWeight: 'bold',
  fontSize: 14,
  },
  anoTextSelecionado: {
    color: '#fff'
  },
  button: {
    width: '100%',
    backgroundColor: '#0096F3',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});