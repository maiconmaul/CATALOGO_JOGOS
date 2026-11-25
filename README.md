# Catálogo de Jogos

Aplicativo de coleção pessoal em React Native, TypeScript e Expo. Os registros são gravados no SQLite do dispositivo. Cada jogo tem título, plataforma, status e observações opcionais.

## Executar

Instale o Node.js LTS e o [Expo Go compatível com o SDK 58](https://expo.dev/go).

```sh
cd CATALOGO_JOGOS
npm ci
npx expo start
```

Escaneie o QR code com um celular ou pressione `i` para abrir o simulador iOS com Xcode. Para abrir um emulador Android já configurado, pressione `a`. Use `npm run typecheck` para verificar o TypeScript.

## Roteiro da apresentação

1. Abra o app pela primeira vez. Confira a mensagem **Nenhum jogo cadastrado**. Use **Novo jogo** para cadastrar pelo menos **10 jogos** pelo formulário e percorra as **duas páginas** com os botões **Próxima** e **Anterior**.
2. Toque em **Novo jogo** e tente cadastrar com o título em branco. Preencha o título, a plataforma e uma observação, escolha o status e toque em **Cadastrar jogo**. O novo item aparece no topo da primeira página. Com o 11º cadastro, o catálogo passa a ter três páginas.
3. Abra o novo jogo para conferir os detalhes. Toque em **Editar jogo**, altere o status e escolha **Salvar alterações**.
4. Vá até a terceira página, abra o último jogo e toque em **Excluir jogo**. Cancele uma vez e confira que os detalhes continuam abertos. Confirme a exclusão na segunda tentativa. O app volta à página 2 de 2.
5. Encerre o Expo Go e reabra o mesmo projeto. Confira que o jogo criado ainda tem o status editado, o jogo excluído continua ausente e o total permanece em 10.
6. Em uma sessão de teste separada, exclua todos os jogos. Reabra o app e verifique a mensagem **Nenhum jogo cadastrado**. O botão **Novo jogo** continua disponível.

## Navegação

O React Navigation Native Stack organiza três telas em `src/telas`. O catálogo mostra a lista paginada, os detalhes consultam o jogo pelo ID e o formulário abre vazio para cadastrar ou preenchido para editar. Ao voltar ao catálogo, a lista é consultada novamente no SQLite.

## Adaptação da referência

O módulo `src/banco.ts` segue a separação do exemplo do professor entre a interface e as operações SQLite. Ele abre `catalogo-jogos.db`, adapta o CRUD de usuários para jogos e usa parâmetros nas consultas. A listagem usa `COUNT(*)`, `LIMIT` e `OFFSET` para consultar cinco registros por página, em ordem decrescente de ID.

A inicialização cria a tabela vazia em uma transação. Os jogos são cadastrados pelo formulário e armazenados no SQLite. O `PRAGMA user_version` registra a versão da estrutura do banco. Em instalações que já possuem registros, os dados existentes continuam disponíveis.

- [Projeto SQLITEMOBILE do professor](https://github.com/Emerson-Rocha/SQLITE/tree/main/SQLITEMOBILE)
- [Documentação do Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
