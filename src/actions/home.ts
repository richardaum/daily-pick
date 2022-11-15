import { Blocks, Surfaces } from 'slack-block-builder';

import { app } from '@/services/slack';

app.event('app_home_opened', async ({ event, client }) => {
  const view = Surfaces.HomeTab({ callbackId: 'home_view' })
    .blocks(
      Blocks.Section({
        text: [
          'Olá 👋',
          'Este é o `Daily Pick` bot. O objetivo deste bot é *alertar sobre tarefas que precisam ser executadas recorrentemente* por um grupo de pessoas, uma pessoa por vez e em sequência.',
          'Para isso, são feitos agendamentos de mensagens que serão enviadas em um canal privado ou público, de acordo com a configuração escolhida.',
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
        title: 'Pick command',
      }),
      Blocks.Image({
        imageUrl: 'https://static.ifood.com.br/daily-pick/daily-pick-running.png',
        altText: 'Running Daily Pick',
        title:
          'Clicando no botão "Pular", você consegue pular uma pessoa da lista, caso ela não esteja disponível para participar, por exemplo.',
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: '*Futuro:*\n As seguintes funcionalidades ainda não existem, mas vão ser implementadas na sequência:',
      }),
      Blocks.Section({
        text: ':one: Mensagens personalizadas. Cada agendamento poderá ter uma mensagem totalmente customizada, onde será possível adicionar informações como link para meetings, instruções gerais, etc.',
      }),
      Blocks.Divider(),
      Blocks.Context().elements(
        [
          ':eyes: Veja todas as tasks usando o comando `/daily list`.',
          ':question: Acesse o menu de ajuda através do comando `/daily`.',
          ':star: Para solicitar novas funcionalidades ou pedir ajuda em problemas específicos, pode falar comigo via DM (<@richard.lopes>)',
        ].join('\n')
      )
    )
    .buildToObject();

  console.log(JSON.stringify(view, null, 2));

  await client.views.publish({
    user_id: event.user,
    view,
  });
});
