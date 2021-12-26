import { SlackViewAction, SlashCommand } from '@slack/bolt';

export interface ViewSubmission {
  payload: SlackViewAction;
}

export interface SlashCommandRequest {
  body: SlashCommand;
}

export interface ViewSubmissionRequest {
  body: ViewSubmission;
}

export type Request = SlashCommandRequest | ViewSubmissionRequest;
