var routes = require('i40')(),
    fs = require('fs'),
    db = require('monk')('localhost/movies'),
    movie = db.get('movie'),
    view = require('./view'),
    url = require('url'),
    mime = require('mime'),
    qs = require('qs')

routes.addRoute('/', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    var template = view.render('home', {})
    res.end(template)
  }
})

routes.addRoute('/movies', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if(req.method === 'GET'){
    movie.find({}, function(err, data) {
      if (err) res.end('Can\'t find the movies' )
      var template = view.render('index', {movie : data})
      res.end(template)
    })
  }
  if(req.method === 'POST') {
    var acumulator = ''
    req.on('data', function(chunk) {
      acumulator += chunk.toString()
    })
    req.on('end', function() {
      var data = qs.parse(acumulator)
      movie.insert(data, function(err, data) {
        if(err) res.end('Issues with data insert')
        res.writeHead(302, {'Location' : '/movies'})
        res.end()
      })
    })
  }
})

routes.addRoute('/movies/new', (req, res, url) => {
  res.setHeader('Content-Type' , 'text/html')
  if(req.method === 'GET') {
    var template = view.render('new', {})
    res.end(template)
  }
})

routes.addRoute('/movies/:id', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movie.findOne({_id : url.params.id}, function(err, doc) {
      if (err) res.end('Sorry, out of popcorn')
      var template = view.render('show', doc)
      res.end(template)
    })
  }
})

routes.addRoute('/movies/:id/edit', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  movie.findOne({_id : url.params.id}, function(err, data) {
    var template = view.render('edit', data)
    res.end(template)
  })
})

routes.addRoute('/movies/:id/update', (req, res, url) => {
  var acumulator = ''
  req.on('data', function(chunk) {
    acumulator += chunk.toString()
  })
  req.on('end', function(err){
    var data = qs.parse(acumulator)
    movie.update({_id : url.params.id}, data, function(err) {
      if(err) res.end('Something went wrong with the data update')
      res.writeHead(302, {'Location' : '/movies'})
      res.end()
    })
  })
})

routes.addRoute('/movies/:id/delete', (req, res, url) => {
  movie.remove({_id : url.params.id}, function(err, data) {
    if (err) res.end('Can\'t update the database')
    res.writeHead(302, {'Location' : '/movies'})
    res.end()
  })
})

 routes.addRoute('/public/*', (req, res, url) => {
   res.setHeader('Content-Type', mime.lookup(req.url))
   fs.readFile('.' + req.url, function(err, file) {
     if (err) res.end('Make sure the wanted file exist')
     res.end(file)
   })
 })
module.exports = routes
