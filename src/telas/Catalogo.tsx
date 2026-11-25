import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { abrirBanco, listarJogos, type PaginaJogos } from '../banco';
import { Botao, Controle, Mensagem, Status, cor } from '../interface';
import type { Rotas } from '../rotas';

export default function Catalogo({ navigation, route }: NativeStackScreenProps<Rotas, 'Catalogo'>) {
  const numero = route.params?.pagina ?? 1;
  const [pagina, setPagina] = useState<PaginaJogos>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, tentarNovamente] = useState(0);

  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');

    async function carregar() {
      try {
        const resultado = await listarJogos(await abrirBanco(), numero);
        if (ativo) setPagina(resultado);
      } catch (erro) {
        console.warn('Erro ao carregar jogos', erro);
        if (ativo) setErro('Não foi possível carregar o catálogo.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregar();
    return () => { ativo = false; };
  }, [numero, tentativa]));

  const bloqueado = carregando || !!erro;

  return (
    <SafeAreaView style={estilos.coluna}>
      <FlatList
        data={erro ? [] : pagina?.jogos ?? []}
        keyExtractor={(jogo) => String(jogo.id)}
        style={estilos.lista}
        contentContainerStyle={estilos.conteudoLista}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
        ListHeaderComponent={
          <>
            <View style={estilos.marca}>
              <View style={estilos.marcaIcone}><Controle size={23} color={cor.escuro} /></View>
              <Text style={estilos.marcaTexto}>Catálogo de Jogos</Text>
            </View>
            <View style={estilos.hero}>
              <View pointerEvents="none" style={estilos.arte}>
                <View style={estilos.anel} />
                <View style={[estilos.anel, estilos.anelInterno]} />
                <Controle size={79} color="#C0E762" />
              </View>
              <Text accessibilityRole="header" style={estilos.titulo}>Minha coleção</Text>
              <Text style={estilos.heroLegenda}>{pagina ? `${pagina.total} ${pagina.total === 1 ? 'jogo cadastrado' : 'jogos cadastrados'}` : 'Jogos cadastrados'}</Text>
            </View>
            <View style={estilos.cabecalhoLista}>
              <Text accessibilityRole="header" style={estilos.subtitulo}>Jogos</Text>
              <Botao titulo="Novo jogo" icone="plus" desabilitado={bloqueado} aoTocar={() => navigation.navigate('Formulario')} />
            </View>
          </>
        }
        ListEmptyComponent={
          carregando ? <ActivityIndicator color={cor.destaque} style={estilos.estado} /> :
          <View style={estilos.estado}>
            {erro ? <>
              <Mensagem>{erro}</Mensagem>
              <Botao titulo="Tentar novamente" variante="secundario" aoTocar={() => tentarNovamente((valor) => valor + 1)} />
            </> : <Text style={estilos.secundario}>Nenhum jogo cadastrado.</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button" accessibilityLabel={`${item.titulo}, ${item.plataforma}, ${item.status}`}
            disabled={bloqueado} onPress={() => navigation.navigate('Detalhes', { id: item.id })}
            style={({ pressed }) => [estilos.item, pressed && { opacity: 0.7 }]}
          >
            <View style={estilos.itemIcone}><Controle size={21} /></View>
            <View style={estilos.itemTexto}>
              <Text style={estilos.itemTitulo} numberOfLines={1}>{item.titulo}</Text>
              <Text style={estilos.itemPlataforma} numberOfLines={1}>{item.plataforma}</Text>
            </View>
            <View style={estilos.itemStatus}><Status status={item.status} /></View>
            <Feather name="chevron-right" size={17} color={cor.secundario} />
          </Pressable>
        )}
      />
      {!!pagina?.totalPaginas && !erro && (
        <View style={estilos.paginacao}>
          <Botao titulo="Anterior" icone="chevron-left" variante="secundario" desabilitado={bloqueado || pagina.pagina === 1}
            aoTocar={() => navigation.setParams({ pagina: pagina.pagina - 1 })} />
          <Text accessibilityLiveRegion="polite" style={estilos.paginaTexto}>Página {pagina.pagina} de {pagina.totalPaginas}</Text>
          <Botao titulo="Próxima" icone="chevron-right" variante="secundario" invertido
            desabilitado={bloqueado || pagina.pagina === pagina.totalPaginas} aoTocar={() => navigation.setParams({ pagina: pagina.pagina + 1 })} />
        </View>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  coluna: { flex: 1, width: '100%', maxWidth: 620, alignSelf: 'center' },
  lista: { flex: 1 },
  conteudoLista: { paddingHorizontal: 20, paddingTop: 9, paddingBottom: 10 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 17 },
  marcaIcone: { width: 37, height: 37, alignItems: 'center', justifyContent: 'center', backgroundColor: cor.destaque, borderRadius: 11 },
  marcaTexto: { color: cor.texto, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  hero: { padding: 19, minHeight: 118, justifyContent: 'center', alignItems: 'flex-start', gap: 6, borderRadius: 18, borderWidth: 1, borderColor: '#465336', backgroundColor: '#222B1C', overflow: 'hidden' },
  arte: { position: 'absolute', right: -8, top: -30, width: 166, height: 170, alignItems: 'center', justifyContent: 'center', opacity: 0.31, transform: [{ rotate: '-16deg' }] },
  anel: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: '#87A958' },
  anelInterno: { width: 123, height: 123, borderRadius: 62 },
  titulo: { color: cor.texto, fontSize: 28, fontWeight: '800', letterSpacing: -0.65 },
  heroLegenda: { color: '#C7D5B8', fontSize: 14, fontWeight: '600' },
  cabecalhoLista: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 10, gap: 10 },
  subtitulo: { color: cor.texto, fontSize: 19, fontWeight: '700' },
  secundario: { color: cor.secundario, fontSize: 15 },
  estado: { alignItems: 'center', paddingVertical: 26, gap: 12 },
  separador: { height: 7 },
  item: { minHeight: 60, backgroundColor: cor.superficie, borderWidth: 1, borderColor: cor.contorno, borderRadius: 13, flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 },
  itemIcone: { width: 37, height: 37, borderRadius: 9, backgroundColor: '#2A3322', alignItems: 'center', justifyContent: 'center' },
  itemTexto: { flex: 1, gap: 3 },
  itemTitulo: { color: cor.texto, fontSize: 14, fontWeight: '700' },
  itemPlataforma: { color: cor.secundario, fontSize: 12 },
  itemStatus: { maxWidth: '42%' },
  paginacao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4, paddingHorizontal: 20, paddingTop: 9, paddingBottom: 7, borderTopWidth: StyleSheet.hairlineWidth, borderColor: cor.contorno },
  paginaTexto: { color: cor.secundario, fontSize: 12, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
});
