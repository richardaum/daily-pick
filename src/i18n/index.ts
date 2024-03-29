export const AVAILABLE_COMMANDS = 'Comandos disponíveis:';
export const TO_ADD_A_NEW_CRON = 'Para adicionar um novo agendamento:';
export const TO_LIST_CRONS = 'Para listar os agendamentos já criados:';
export const CRONS = 'Agendamentos';
export const BY_CREATION_DATE = 'por data de criação';
export const NO_CRONS_FOUND = 'Nenhum agendamento encontrado';
export const REMOVE = ':wastebasket: Remover';
export const DELETE_MESSAGE = ':white_check_mark: OK';
export const BACK_TO_LIST = ':back: Ir para agendamentos';
export const EDIT = ':pencil: Editar agendamento';
export const ITS_YOUR_TURN = 'é sua vez na daily de hoje!';
export const EXISTING_USER_ERROR_MESSAGE = 'Este usuário já participa desta atividade.';
export const SEE_DETAILS_RESUMED_MESSAGE = 'Abra o Slack para ver os detalhes do agendamento.';
export const NEXT_TIME = 'Na próxima vez é você';
export const NAME_LABEL = 'Apelido do agendamento';
export const NAME_EXPLANATION = 'Apenas um nome pra você lembrar desde agendamento.';
export const MESSAGE_LABEL = 'Mensagem de agendamento';
export const NAME_INPUT_PLACEHOLDER = 'Escolha uma apelido para o agendamento';
export const MESSAGE_PLACEHOLDER = 'Escolha uma mensagem para ser exibida toda vez que o agendamento for acionado.';
export const PICK_USERS_PLACEHOLDER = 'Escolhe a galera aqui';
export const TEAM_LABEL = 'Participantes';
export const SUNDAY_LABEL = 'Domingo';
export const MONDAY_LABEL = 'Segunda';
export const TUESDAY_LABEL = 'Terça';
export const WEDNESDAY_LABEL = 'Quarta';
export const THURSDAY_LABEL = 'Quinta';
export const FRIDAY_LABEL = 'Sexta';
export const SATURDAY_LABEL = 'Sábado';
export const MODAL_TITLE = 'Daily Pick';
export const SUBMIT_BUTTON = 'Enviar';
export const CLOSE_BUTTON = 'Fechar';
export const SELECT_AT_LEAST_ONE_WEEKDAY = 'Selecione pelo menos um dia da semana';
export const INCLUDE_BOT_MESSAGE = 'Você precisa incluir o bot @Daily Pick no canal/channel.';
export const YOUR_CRON = 'Seu agendamento';
export const WAS_CREATED = 'foi criado';
export const MORE_INFO = 'Para mais informação, entre em contato com @richard.lopes';
export const OUTSIDE_CHANNEL_MESSAGE = 'Desculpe, este comando só pode ser executado dentro de um canal';
export const TRIGGER = ':arrow_forward: Acionar';
export const IGNORE = ':x: Ignorar';
export const BACK = ':rewind: Voltar para {previous}';
export const SKIP = ':fast_forward: Pular para {next}';
export const ADD_BOT_INTEGRATION_MESSAGE = [
  'Primeiro, você precisa adicionar a integração do Daily Pick neste canal.',
  'Você pode fazer isso agora, digtando o seguinte comando `/invite @Daily Pick`.',
].join('\n');
export const ALREADY_ADDED_BOT_INTEGRATION = 'Já adicionei!';
export const CANCELD_ADDING_BOT_INTEGRATION = 'Cancelar';
export const MESSAGE_INPUT_EXPLANATION = [
  'Por exemplo: `Hoje é a sua vez, {currentUserMention}!`',
  'Sugestão: Adicione links no seu agendamento. Exemplo: link do Google Meet.',
  '*Variáveis aceitas:*',
  '`{currentUserMention}`: Menciona a/o parcipante da vez',
  '`{nextUserName}`: Exibe o nome da/o próxima/o participante',
].join('\n');
export const SETTINGS = ':gear: Configurações';
export const LIST_SETTINGS = ':gear: Configurações';
export const SETTINGS_TEXT = 'Abra o Slack para ver as configurações de {cronName}';
