const { ShardingManager } = require("discord.js"),
  c = require('colours'),
  manager = new ShardingManager(`./index.js`, {
    totalShards: 2,
    respawn: true,
    token: process.env.TOKEN,
  });

manager.on(`shardCreate`, shard => console.log(c.red(`[Shards] - Logado na shard ${shard.id +1}`))); 

manager.spawn();
