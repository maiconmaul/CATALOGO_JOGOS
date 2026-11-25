import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { abrirBanco, excluirJogo } from '../banco';
import { Botao, Controle, Mensagem, Status, cor } from '../interface';
import type { Rotas } from '../rotas';
import { useGravacao } from '../useGravacao';
import { useJogo } from '../useJogo';
import ConteudoJogo, { EstadoConsulta } from './ConteudoJogo';

export default function Detalhes({ navigation, route }: NativeStackScreenProps<Rotas, 'Detalhes'>) {
  const consulta = useJogo(route.params.id);
  const { ocupado, erro, executar } = useGravacao();
  const { jogo } = consulta;

  return (
    <ConteudoJogo>
      {jogo ? (
        <>
          <View style={estilos.detalhe}>
            <View style={estilos.icone}><Controle size={30} /></View>
            <Text style={estilos.titulo}>{jogo.titulo}</Text>
            <Text style={estilos.secundario}>{jogo.plataforma}</Text>
            <Status status={jogo.status} />
          </View>
          <View style={estilos.detalhe}>
            <Text style={estilos.subtitulo}>Observações</Text>
            <Text style={estilos.observacoes}>{jogo.observacoes || 'Sem observações.'}</Text>
          </View>
          {!!erro && <Mensagem>{erro}</Mensagem>}
          <Botao titulo="Editar jogo" icone="edit-2" desabilitado={ocupado}
            aoTocar={() => navigation.navigate('Formulario', { id: jogo.id })} />
          <Botao titulo="Excluir jogo" icone="trash-2" variante="perigo" ocupado={ocupado}
            aoTocar={() => Alert.alert('Excluir jogo?', `“${jogo.titulo}” será removido da coleção.`, [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => void executar(
                  async () => excluirJogo(await abrirBanco(), jogo.id),
                  () => navigation.goBack(),
                  'Não foi possível excluir o jogo. Tente novamente.',
                ),
              },
            ], { cancelable: true })} />
        </>
      ) : <EstadoConsulta {...consulta} />}
    </ConteudoJogo>
  );
}

const estilos = StyleSheet.create({
  detalhe: { backgroundColor: cor.superficie, borderWidth: 1, borderColor: cor.contorno, borderRadius: 15, padding: 16, gap: 9 },
  icone: { alignSelf: 'flex-start', backgroundColor: '#2A3322', padding: 10, borderRadius: 12, marginBottom: 4 },
  titulo: { color: cor.texto, fontSize: 28, fontWeight: '800', letterSpacing: -0.65 },
  secundario: { color: cor.secundario, fontSize: 15 },
  subtitulo: { color: cor.texto, fontSize: 19, fontWeight: '700' },
  observacoes: { color: cor.secundario, fontSize: 15, lineHeight: 22 },
});
