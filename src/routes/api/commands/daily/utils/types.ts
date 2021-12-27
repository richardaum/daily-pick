import { BlockAction, SlackViewAction, SlashCommand } from '@slack/bolt';

export interface BlockActionPayload {
  payload: BlockAction;
}

export interface ViewSubmission {
  payload: SlackViewAction;
}

export interface SlashCommandRequest {
  body: SlashCommand;
}

export interface ViewSubmissionRequest {
  body: ViewSubmission;
}

export interface BlockActionRequest {
  body: BlockActionPayload;
}

export type Request = SlashCommandRequest | ViewSubmissionRequest | BlockActionRequest;
