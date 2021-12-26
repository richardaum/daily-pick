import { Blocks, InputBuilder, InputParams } from 'slack-block-builder';

export const CustomBlocks = {
  Input: Blocks.Input as (params?: (InputParams & { optional?: boolean }) | undefined) => InputBuilder,
};
