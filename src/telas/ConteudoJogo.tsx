import type { PropsWithChildren } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Mensagem, cor } from '../interface';

export default function ConteudoJogo({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={estilos.coluna}>
      <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function EstadoConsulta({ carregando, erro, tentarNovamente }: {
  carregando: boolean;
  erro: string;
  tentarNovamente: () => void;
}) {
  if (carregando) return <ActivityIndicator color={cor.destaque} />;
  return (
    <>
      <Mensagem>{erro}</Mensagem>
      <Botao titulo="Tentar novamente" variante="secundario" aoTocar={tentarNovamente} />
    </>
  );
}

const estilos = StyleSheet.create({
  coluna: { flex: 1, width: '100%', maxWidth: 620, alignSelf: 'center' },
  flex: { flex: 1 },
  conteudo: { padding: 20, gap: 12 },
});
