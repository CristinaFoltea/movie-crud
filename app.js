var http = require('http'),
    router = require('./routes'),
    url = require('url')

var server = http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  var path = url.parse(req.url).pathname
  var currentRoute = router.match(path)
  if (currentRoute){
    currentRoute.fn(req, res, currentRoute)
  }
  else {
    res.writeHead(404, {'Content-Type' : 'text/html'})
    res.end('Dead End')
  }
})

server.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log('Wonk Wonk', err)
  console.log('Server running on port 9000')
})
