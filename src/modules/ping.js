const express = require('express'),
  app = express();

module.exports = class Ping {
  constructor(client) {
    this.client = client;
  }

  async run() {
    app.get('/', (req, res) => {
      const ping = new Date();
	    ping.setHours(ping.getHours() - 3);
	    console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
      res.sendStatus(200)
    })
    app.listen(process.env.PORT);
  }
}