const express = require('express')
const client = require('./next')

const port = parseInt(process.env.PORT, 10) || 5000
const handle = client.getRequestHandler()

client.prepare().then(() => {
  const server = express()

  server.get('/a', (req, res) => {
    return client.render(req, res, '/a', req.query)
  })

  server.get('/b', (req, res) => {
    return client.render(req, res, '/b', req.query)
  })
  
  // heart beat
  server.get("/heart_beat", (_req, res) => {
    return res.end(JSON.stringify(Date.now()));
  });

	server.get('/', (req, res) => {
		res.data = "data";
    return client.render(req, res, '/', req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
