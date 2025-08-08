const client = require('../../yuki')
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require("discord-player-youtubei");

module.exports = {
  name: 'musicCreate',
};

const player = new Player(client);
player.extractors.loadMulti(DefaultExtractors);
player.extractors.register(YoutubeiExtractor, {})