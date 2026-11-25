import { useEffect, useState } from 'react';

import { abrirBanco, consultarJogo } from './banco';
import type { Jogo } from './jogos';

export function useJogo(id?: number) {
  const [jogo, setJogo] = useState<Jogo>();
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (id === undefined) return;
    let ativo = true;

    void (async () => {
      try {
        const resultado = await consultarJogo(await abrirBanco(), id);
        if (!resultado) throw new Error('Jogo não encontrado.');
        if (ativo) setJogo(resultado);
      } catch (erro) {
        console.warn('Erro ao consultar jogo', erro);
        if (ativo) setErro('Não foi possível carregar o jogo.');
      }
    })();

    return () => { ativo = false; };
  }, [id, tentativa]);

  return {
    jogo,
    erro,
    carregando: id !== undefined && !jogo && !erro,
    tentarNovamente: () => {
      setErro('');
      setTentativa((valor) => valor + 1);
    },
  };
}
