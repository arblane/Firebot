// Migration: done

"use strict";

const twitchApi = require("../../twitch-api/client");
const accountAccess = require("../../common/account-access");
const { OutputDataType } = require("../../../shared/variable-contants");

const model = {
    definition: {
        handle: "game",
        description: "Gets the current game set for your channel",
        examples: [
            {
                usage: "game[$target]",
                description: "When in a command, gets the game set for the target user."
            },
            {
                usage: "game[$user]",
                description: "Gets the game set for associated user (Ie who triggered command, pressed button, etc)."
            },
            {
                usage: "game[ChannelOne]",
                description: "Gets the game set for a specific channel."
            }
        ],
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: async (_, username) => {
        if (username == null) {
            username = accountAccess.getAccounts().streamer.username;
        }

        const twitchClient = twitchApi.getClient();

        try {
            const streamInfo = await twitchClient.helix.streams.getStreamByUserName(username);
            const gameInfo = streamInfo.getGame();

            return gameInfo.name != null ? gameInfo.name : "[]";

        } catch (ignore) {
            return "[No game set]";
        }
    }
};

module.exports = model;