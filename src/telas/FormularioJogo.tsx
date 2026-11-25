import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Keyboard } from 'react-native';

import { abrirBanco, cadastrarJogo, editarJogo } from '../banco';
import Formulario from '../Formulario';
import type { DadosJogo } from '../jogos';
import type { Rotas } from '../rotas';
import { useGravacao } from '../useGravacao';
import { useJogo } from '../useJogo';
import ConteudoJogo, { EstadoConsulta } from './ConteudoJogo';

export default function FormularioJogo({ navigation, route }: NativeStackScreenProps<Rotas, 'Formulario'>) {
  const id = route.params?.id;
  const consulta = useJogo(id);
  const { ocupado, erro, executar } = useGravacao();

  function salvar(dados: DadosJogo) {
    void executar(
      async () => {
        const db = await abrirBanco();
        if (id === undefined) {
          await cadastrarJogo(db, dados);
        } else {
          await editarJogo(db, id, dados);
        }
      },
      () => {
        Keyboard.dismiss();
        if (id === undefined) {
          navigation.popTo('Catalogo', { pagina: 1 });
        } else {
          navigation.popToTop();
        }
      },
      'Não foi possível salvar o jogo. Tente novamente.',
    );
  }

  return (
    <ConteudoJogo>
      {id === undefined || consulta.jogo ? (
        <Formulario jogo={consulta.jogo} salvar={salvar} ocupado={ocupado} erro={erro} />
      ) : <EstadoConsulta {...consulta} />}
    </ConteudoJogo>
  );
}
