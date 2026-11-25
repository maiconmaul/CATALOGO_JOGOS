import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import type { DadosJogo, Jogo } from './jogos';

export const JOGOS_POR_PAGINA = 5;
export type PaginaJogos = { jogos: Jogo[]; pagina: number; total: number; totalPaginas: number };

let inicializacao: Promise<SQLiteDatabase> | undefined;

export function abrirBanco() {
  inicializacao ??= prepararBanco().catch((erro: unknown) => {
    inicializacao = undefined;
    throw erro;
  });
  return inicializacao;
}

async function prepararBanco() {
  const db = await openDatabaseAsync('catalogo-jogos.db');

  try {
    await db.execAsync('PRAGMA journal_mode = WAL');
    await db.withExclusiveTransactionAsync(async (transacao) => {
      const versao = await transacao.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
      if (versao?.user_version === 0) {
        await transacao.execAsync(`
          CREATE TABLE jogos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL CHECK (length(trim(titulo)) > 0),
            plataforma TEXT NOT NULL CHECK (length(trim(plataforma)) > 0),
            status TEXT NOT NULL CHECK (status IN ('Quero jogar', 'Jogando', 'Concluído')),
            observacoes TEXT NOT NULL DEFAULT ''
          )
        `);
        await transacao.execAsync('PRAGMA user_version = 1');
      }
    });
    return db;
  } catch (erro) {
    await db.closeAsync();
    throw erro;
  }
}

export async function listarJogos(db: SQLiteDatabase, paginaSolicitada: number): Promise<PaginaJogos> {
  const contagem = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM jogos');
  const total = contagem?.total ?? 0;
  const totalPaginas = Math.ceil(total / JOGOS_POR_PAGINA);
  const pagina = Math.max(1, Math.min(paginaSolicitada, totalPaginas));
  const jogos = await db.getAllAsync<Jogo>(
    'SELECT id, titulo, plataforma, status, observacoes FROM jogos ORDER BY id DESC LIMIT ? OFFSET ?',
    JOGOS_POR_PAGINA,
    (pagina - 1) * JOGOS_POR_PAGINA,
  );

  return { jogos, pagina, total, totalPaginas };
}

export function consultarJogo(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Jogo>(
    'SELECT id, titulo, plataforma, status, observacoes FROM jogos WHERE id = ?',
    id,
  );
}

export async function cadastrarJogo(db: SQLiteDatabase, jogo: DadosJogo) {
  const resultado = await db.runAsync(
    'INSERT INTO jogos (titulo, plataforma, status, observacoes) VALUES (?, ?, ?, ?)',
    jogo.titulo, jogo.plataforma, jogo.status, jogo.observacoes,
  );
  return resultado.lastInsertRowId;
}

export async function editarJogo(db: SQLiteDatabase, id: number, jogo: DadosJogo) {
  const resultado = await db.runAsync(
    'UPDATE jogos SET titulo = ?, plataforma = ?, status = ?, observacoes = ? WHERE id = ?',
    jogo.titulo, jogo.plataforma, jogo.status, jogo.observacoes, id,
  );
  if (resultado.changes === 0) throw new Error('Jogo não encontrado.');
}

export async function excluirJogo(db: SQLiteDatabase, id: number) {
  const resultado = await db.runAsync('DELETE FROM jogos WHERE id = ?', id);
  if (resultado.changes === 0) throw new Error('Jogo não encontrado.');
}
