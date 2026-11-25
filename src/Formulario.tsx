import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Botao, cor, Mensagem } from './interface';
import { STATUS, type DadosJogo, type Jogo, type StatusJogo } from './jogos';

export default function Formulario({
  jogo, salvar, ocupado, erro,
}: {
  jogo?: Jogo;
  salvar: (dados: DadosJogo) => void;
  ocupado: boolean;
  erro: string;
}) {
  const [titulo, setTitulo] = useState(jogo?.titulo ?? '');
  const [plataforma, setPlataforma] = useState(jogo?.plataforma ?? '');
  const [status, setStatus] = useState<StatusJogo>(jogo?.status ?? 'Quero jogar');
  const [observacoes, setObservacoes] = useState(jogo?.observacoes ?? '');
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const faltaTitulo = tentouSalvar && !titulo.trim();
  const faltaPlataforma = tentouSalvar && !plataforma.trim();

  function enviar() {
    setTentouSalvar(true);
    if (!titulo.trim() || !plataforma.trim()) return;
    salvar({ titulo: titulo.trim(), plataforma: plataforma.trim(), status, observacoes: observacoes.trim() });
  }

  return (
    <View style={estilos.formulario}>
      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Título</Text>
        <TextInput accessibilityLabel="Título" testID="titulo" style={[estilos.input, faltaTitulo && estilos.invalido]}
          placeholder="Ex. Super Mario Odyssey" placeholderTextColor={cor.secundario} value={titulo}
          onChangeText={setTitulo} editable={!ocupado} keyboardAppearance="dark" />
        {faltaTitulo && <Mensagem>Informe o título do jogo.</Mensagem>}
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Plataforma</Text>
        <TextInput accessibilityLabel="Plataforma" testID="plataforma" style={[estilos.input, faltaPlataforma && estilos.invalido]}
          placeholder="Ex. Nintendo Switch" placeholderTextColor={cor.secundario} value={plataforma}
          onChangeText={setPlataforma} editable={!ocupado} keyboardAppearance="dark" />
        {faltaPlataforma && <Mensagem>Informe a plataforma.</Mensagem>}
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Status</Text>
        <View style={estilos.opcoes}>
          {STATUS.map((opcao) => (
            <Pressable key={opcao} accessibilityRole="radio" accessibilityState={{ checked: opcao === status, disabled: ocupado }}
              disabled={ocupado} onPress={() => setStatus(opcao)}
              style={({ pressed }) => [
                estilos.opcao, opcao === status && estilos.selecionada, pressed && { opacity: 0.7 },
              ]}>
              <Text style={[estilos.opcaoTexto, opcao === status && estilos.selecionadaTexto]}>{opcao}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Observações <Text style={estilos.opcional}>(opcional)</Text></Text>
        <TextInput accessibilityLabel="Observações" style={[estilos.input, estilos.area]} multiline
          placeholder="Anote algo sobre o jogo" placeholderTextColor={cor.secundario} value={observacoes}
          onChangeText={setObservacoes} editable={!ocupado} keyboardAppearance="dark" />
      </View>

      {!!erro && <Mensagem>{erro}</Mensagem>}
      <Botao titulo={jogo ? 'Salvar alterações' : 'Cadastrar jogo'} icone="check" aoTocar={enviar} ocupado={ocupado} />
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { gap: 20 },
  campo: { gap: 8 },
  rotulo: { fontSize: 14, color: cor.texto, fontWeight: '700' },
  opcional: { color: cor.secundario, fontWeight: '400' },
  input: { color: cor.texto, backgroundColor: cor.superficie, borderWidth: 1, borderColor: cor.contorno, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 48, fontSize: 16 },
  invalido: { borderColor: cor.erro },
  area: { minHeight: 100, textAlignVertical: 'top' },
  opcoes: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  opcao: { borderWidth: 1, borderColor: cor.contorno, borderRadius: 10, paddingHorizontal: 12, minHeight: 44, justifyContent: 'center' },
  opcaoTexto: { color: cor.secundario, fontWeight: '600', fontSize: 13 },
  selecionada: { backgroundColor: '#29351B', borderColor: cor.destaque },
  selecionadaTexto: { color: cor.destaque },
});
