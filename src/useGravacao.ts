import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { useRef, useState } from 'react';

export function useGravacao() {
  const navigation = useNavigation();
  const emCurso = useRef(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');

  usePreventRemove(ocupado, ({ data }) => {
    if (!emCurso.current) navigation.dispatch(data.action);
  });

  async function executar(gravar: () => Promise<unknown>, concluir: () => void, mensagem: string) {
    if (emCurso.current) return;
    emCurso.current = true;
    setOcupado(true);
    setErro('');

    try {
      await gravar();
    } catch (erro) {
      console.warn(mensagem, erro);
      setErro(mensagem);
      return;
    } finally {
      emCurso.current = false;
      setOcupado(false);
    }

    concluir();
  }

  return { ocupado, erro, executar };
}
