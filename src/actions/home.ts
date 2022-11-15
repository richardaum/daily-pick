import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { app } from '@/services/slack';

app.event('app_home_opened', async ({ event, client }) => {
  const view = Surfaces.HomeTab({ callbackId: 'home_view' })
    .blocks(
      Blocks.Section({
        text: [
          'Olá 👋',
          [
            'Este é o `Daily Pick` bot. O objetivo deste bot é alertar :bell: sobre tarefas que precisam ser executadas ',
            'com frequência :calendar: por um grupo de pessoas :people_holding_hands:, uma pessoa por vez e em sequência.',
          ].join(''),
          [
            'Para isso, são feitos agendamentos de mensagens conforme a configuração escolhida. ',
            'Essas mensagens serão enviadas para um canal onde você criou o agendamento.',
          ].join(''),
        ].join('\n'),
      }),
      Blocks.Section({
        text: ':one: Use o comando `/daily pick` dentro de um canal, privado ou público, para criar um agendamento.',
      }),
      Blocks.Section({
        text: ':two: Siga as instruções de preenchimento com nome do agendamento, pessoas a serem acionadas e configure os horários.',
      }),
      Blocks.Image({
        imageUrl: 'https://static.ifood.com.br/daily-pick/daily-pick-command-pick.png',
        altText: 'Pick command',
        title:
          'A imagem pode estar desatualizada, mas aqui você faz as configurações do seu agendamento. Veja as funcionalidades disponíveis na seção abaixo.',
      }),
      Blocks.Image({
        imageUrl: 'https://static.ifood.com.br/daily-pick/daily-pick-running.png',
        altText: 'Running Daily Pick',
        title:
          'Clicando no botão "Pular", você consegue pular uma pessoa da lista, caso ela não esteja disponível para participar, por exemplo.',
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: '*Funcionalidades existentes:*',
      }),
      Blocks.Section({ text: ':one: Configurações de horário por dia da semana.' }),
      Blocks.Section({
        text: ':two: Messagem personalizada por agendamento. Adicione links, instruções gerais, o campo é livre :)',
      }),
      Blocks.Section({ text: ':four: Botão "Pular" avança para a próxima pessoa da lista.' }),
      Blocks.Divider(),
      Blocks.Section({
        text: '*Restrições:*',
      }),
      Blocks.Section({ text: ':one: Funciona *apenas* em canais/channels (públicos ou privados).' }),
      Blocks.Section({
        text: ':two: Para adicionar ou remover participantes, você precisa deletar e criar o agendamento novamente.',
      }),
      Blocks.Divider(),
      Blocks.Section({ text: '*Futuro:*' }),
      Blocks.Context().elements('As seguintes funcionalidades ainda não existem:'),
      Blocks.Section({
        text: ':one: Adicionar e remover participantes do agendamento, sem precisar excluir e criar o agendamento novamente.',
      }),
      Blocks.Divider(),
      Blocks.Context().elements(
        ':eyes: Veja todas as tasks usando o comando `/daily list`.',
        ':question: Acesse o menu de ajuda através do comando `/daily`.',
        ':star: Para solicitar novas funcionalidades ou pedir ajuda em problemas específicos, pode falar comigo via DM (<@richard.lopes>)'
      )
    )
    .buildToObject();

  await client.views.publish({
    user_id: event.user,
    view,
  });
});
