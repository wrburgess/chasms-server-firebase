import axios from 'axios';

import { SLACK_EPHEMERAL_MESSAGE_URI, SLACK_PUBLIC_MESSAGE_URI } from '../constants/config';

// message = {
//   id: '8ffcd872-adc8-496f-aca2-a796d8e3f8f0',
//   status: 200,
//   type: 'slackInbound',
//   requestBody: '+Rey62 Maiores dolor ex odit eos sunt itaque est.',
//   validRequest: true,
//   archived: false,
//   attachments: [],
//   tags: [],
//   smsInboundNumber: '',
//   source: {
//     type: 'slack',
//     meta: {
//       token: '2d83ce4e-53a3-49af-b81e-92b2d34ebf2a',
//       team_id: '93ec9c31-bd27-4263-90b9-e9f59475a218',
//       team_domain: 'Burnice70',
//       channel_id: '+16489671675',
//       channel_name: 'privategroup',
//       user_id: '3f839e3b-1165-4f87-a241-410ac2069f01',
//       user_name: 'Viviane_Brakus',
//       command: '/sms',
//       text: '+Rey62 Maiores dolor ex odit eos sunt itaque est.',
//       response_url: 'https://hooks.slack.com/commands/6a4cfc1c-8e67-41c3-87bb-a33ed80f30e2',
//       trigger_id: '8fe81044-2e1a-410f-8d83-366cbc7b0bd8',
//     },
//   },
//   author: {
//     type: 'operator',
//     id: '464118e1-ef35-4ae4-87ca-23db5ccf1fd9',
//     firstName: 'Lon',
//     lastName: 'Gutmann',
//     username: 'Dante.Block',
//     completeSmsNumber: '+1901546939',
//     email: 'Cleora_Jacobson76@yahoo.com',
//   },
//   organization: {
//     id: '396e8bf9-91af-4a17-9f3f-76aee11ccf90',
//     name: 'Renner - Hayes',
//   },
//   channelResponse: { body: '', id: '', name: '', status: false },
//   apiResponse: { status: false, body: '' },
//   slackResponse: {
//     body: 'Unknown username for command: +Rey62 Maiores dolor ex odit eos sunt itaque est.',
//     channel_id: '+16489671675',
//     response_type: 'ephemeral',
//     status: true,
//     token: '2d83ce4e-53a3-49af-b81e-92b2d34ebf2a',
//   },
//   smsResponse: { body: '', completeSmsNumber: '', contact: {}, status: false },
// };

class SlackOutbound {
  static async sendPublicMessage(message: any) {
    try {
      const { token, channel_id, body } = message.slackResponse;
      const { attachments } = message;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios.post(
        SLACK_PUBLIC_MESSAGE_URI,
        {
          as_user: false,
          channel: channel_id,
          link_names: true,
          text: body,
          attachments,
        },
        config,
      );
    } catch (err) {
      console.error('SlackOutbound > sendPublicMessage: ', err);
    }
  }

  static async sendEphemeralMessage(message: any) {
    try {
      const { token, channel_id, body } = message.slackResponse;
      const { attachments } = message;
      const { user_id } = message.source.meta.user_id;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        attachments,
        as_user: true,
        channel: channel_id,
        link_names: true,
        text: body,
        user: user_id,
      };

      axios.post(SLACK_EPHEMERAL_MESSAGE_URI, payload, config);
    } catch (err) {
      console.error('SlackOutbound > sendEphemeralMessage: ', err);
    }
  }
}

export default SlackOutbound;
