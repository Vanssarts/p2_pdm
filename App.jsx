import { FlatList, Pressable, StyleSheet, Text, View, Image, Linking, ScrollView, Dimensions } from 'react-native';
import Busca from './components/Busca';
import { useState, useEffect } from "react";
import nasaClient from './utils/nasaClient';
import AntIcon from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const screenWidth = Dimensions.get('window').width
  const isMobile = screenWidth < 500

  const [photos, setPhotos] = useState([]);
  const [fotosDia, setFotosDia] = useState([]);
  
  useEffect(() => {
    const carregarFotosDia = async () => {
      try {
        
        const armazenadas = await AsyncStorage.getItem('@fotos_dia');
        let lista = [];
        if (armazenadas) {
          lista = JSON.parse(armazenadas);
        }

        
        const resposta = await nasaClient.get('apod');
        const novaFoto = resposta.data; 

        
        const jaExiste = lista.some(f => f.date === novaFoto.date);

        let listaAtualizada;
        if (jaExiste) {
          
          listaAtualizada = [
            novaFoto,
            ...lista.filter(f => f.date !== novaFoto.date)
          ];
        } else {
          
          listaAtualizada = [novaFoto, ...lista];
        }

        console.log('Fotos do dia atualizadas:', listaAtualizada); 

        setFotosDia(listaAtualizada);
        await AsyncStorage.setItem('@fotos_dia', JSON.stringify(listaAtualizada));
      } catch (erro) {
        console.log(erro);
      }
    };

    carregarFotosDia();
  }, []);

  const onBuscaRealizada = (termo, ano) => {
    nasaClient.get('search/', {
      params: {
        q: termo,
        year: ano
      }
    })
      .then(result => {
        const somenteImagens = result.data.photos.filter(
          item => item.data?.[0]?.media_type === "image"
        );
        const dezPrimeiras = somenteImagens.filter((_, index) => index < 10);

        setPhotos(dezPrimeiras);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fotoDia = fotosDia[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {fotoDia && (
        <View style={styles.apodContainer}>
          <Text style={styles.apodTitle}>Foto do dia – {fotoDia.date}</Text>
          <Text style={styles.apodSubtitle}>{fotoDia.title}</Text>
          <Image
            source={{ uri: fotoDia.url }}
            style={styles.apodImage}
          />
        </View>
      )}

      {fotosDia.length > 1 && (
        <View style={styles.apodListContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {fotosDia.map(foto => (
              <View key={foto.date} style={styles.apodThumb}>
                <Image
                  source={{ uri: foto.url }}
                  style={styles.apodThumbImage}
                />
                <Text style={styles.apodThumbText}>{foto.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Busca onBuscaRealizada={onBuscaRealizada} />

      <View style={styles.listContainer}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.data[0].nasa_id}
          numColumns={isMobile ? 1 : 2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => {
            const info = item.data?.[0];
            const imageUrl = item.links?.[0]?.href;

            return (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>
                  {info?.title}
                </Text>

                {imageUrl && (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 200, height: 200 }}
                  />
                )}

                <Text style={styles.description}>
                  {info?.description}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="face-man-profile" size={36} color="black" />
        <Text>Gustavo Assis</Text>
        <View style={styles.socialIcons}>
          <Pressable
            onPress={() => Linking.openURL('https://www.linkedin.com/in/gustavo-assis-santos-2175a335a/')}>
            <FontAwesome name="linkedin-square" size={28} color="black" />
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL('https://github.com/gustavo-Assis-Santos/')}>
            <AntIcon name='github' size={28} color="black" />
          </Pressable>
        </View>
        <AntIcon name='line' size={28} color="black" />
        <MaterialCommunityIcons name="face-woman-profile" size={36} color="black" />
        <Text>Vanessa Cristina</Text>
        <View style={styles.socialIcons}>
          <Pressable
            onPress={() => Linking.openURL('https://www.linkedin.com/in/vansalcantara/')}>
            <FontAwesome name="linkedin-square" size={28} color="black" />
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL('https://github.com/Vanssarts')}>
            <AntIcon name='github' size={28} color="black" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    paddingBottom: 20
  },
  apodContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12
  },
  apodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },
  apodSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center'
  },
  apodImage: {
    width: 300,
    height: 200,
    borderRadius: 4
  },
  apodListContainer: {
    width: '80%',
    marginBottom: 10
  },
  apodThumb: {
    alignItems: 'center',
    marginRight: 8
  },
  apodThumbImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginBottom: 4
  },
  apodThumbText: {
    fontSize: 12
  },
  listContainer: {
    width: '80%',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10
  },
  listItem: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center'
  },
  listItemText: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginTop: 2
  },
  footer: {
    borderColor: '#DDD',
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
    padding: 35,
    marginTop: 8,
    borderRadius: 4,
    marginBottom: 10
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 16
  },
  image: {
  width: '100%',
  height: 220,
  borderRadius: 6
  }
});