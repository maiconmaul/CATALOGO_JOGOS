import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { cor } from './src/interface';
import type { Rotas } from './src/rotas';
import Catalogo from './src/telas/Catalogo';
import Detalhes from './src/telas/Detalhes';
import FormularioJogo from './src/telas/FormularioJogo';

const Stack = createNativeStackNavigator<Rotas>();
const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cor.fundo,
    card: cor.fundo,
    text: cor.texto,
    border: cor.contorno,
    primary: cor.destaque,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={tema}>
        <Stack.Navigator>
          <Stack.Screen name="Catalogo" component={Catalogo} options={{ title: 'Catálogo de Jogos', headerShown: false }} />
          <Stack.Screen name="Detalhes" component={Detalhes} options={{ title: 'Detalhes do jogo', headerBackButtonDisplayMode: 'minimal' }} />
          <Stack.Screen name="Formulario" component={FormularioJogo} options={({ route }) => ({
            title: route.params ? 'Editar jogo' : 'Novo jogo',
            headerBackButtonDisplayMode: 'minimal',
          })} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
