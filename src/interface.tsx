import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ComponentProps, PropsWithChildren } from 'react';

import type { StatusJogo } from './jogos';

export const cor = {
  fundo: '#101216',
  superficie: '#191D25',
  contorno: '#2B313D',
  texto: '#F6F7F9',
  secundario: '#A5ADBD',
  destaque: '#D5FA70',
  escuro: '#18210C',
  erro: '#FFB1BA',
};

type Icone = ComponentProps<typeof Feather>['name'];

export function Controle({ size = 24, color = cor.destaque }: { size?: number; color?: string }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <MaterialCommunityIcons name="gamepad-variant-outline" size={size} color={color} />
    </View>
  );
}

export function Status({ status }: { status: StatusJogo }) {
  const cores = {
    'Quero jogar': { fundo: '#292439', texto: '#D6BAFC' },
    Jogando: { fundo: '#342A1C', texto: '#FFCE83' },
    Concluído: { fundo: '#233020', texto: '#B9E995' },
  }[status];

  return (
    <View style={[estilos.status, { backgroundColor: cores.fundo }]}>
      <View style={[estilos.ponto, { backgroundColor: cores.texto }]} />
      <Text style={[estilos.statusTexto, { color: cores.texto }]}>{status}</Text>
    </View>
  );
}

export function Botao({
  titulo, icone, aoTocar, variante = 'primario', desabilitado = false, ocupado = false, invertido = false,
}: {
  titulo: string;
  icone?: Icone;
  aoTocar: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  desabilitado?: boolean;
  ocupado?: boolean;
  invertido?: boolean;
}) {
  const texto = variante === 'primario' ? cor.escuro : variante === 'perigo' ? cor.erro : cor.texto;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: desabilitado || ocupado, busy: ocupado }}
      disabled={desabilitado || ocupado}
      onPress={aoTocar}
      style={({ pressed }) => [
        estilos.botao,
        variante === 'primario' ? estilos.primario : estilos.secundario,
        invertido && estilos.invertido,
        (pressed || desabilitado) && estilos.atenuado,
      ]}
    >
      {ocupado ? <ActivityIndicator size="small" color={texto} /> : icone && <Feather name={icone} size={17} color={texto} />}
      <Text style={[estilos.botaoTexto, { color: texto }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Mensagem({ children }: PropsWithChildren) {
  return <Text accessibilityRole="alert" style={estilos.erro}>{children}</Text>;
}

const estilos = StyleSheet.create({
  botao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12 },
  primario: { backgroundColor: cor.destaque },
  secundario: { backgroundColor: cor.superficie, borderWidth: 1, borderColor: cor.contorno },
  invertido: { flexDirection: 'row-reverse' },
  atenuado: { opacity: 0.48 },
  botaoTexto: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, alignSelf: 'flex-start' },
  ponto: { width: 5, height: 5, borderRadius: 3 },
  statusTexto: { fontSize: 11, fontWeight: '700' },
  erro: { color: cor.erro, fontSize: 14, lineHeight: 21 },
});
