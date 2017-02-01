var http = require("http");
var app = require('express')();
var labygenerator = require('./laby_generator.js');
var tailleTableau = 25;//à changer également dans laby_generator.js

httpServer = http.createServer(app);

app.get('/', function (req, res) {
 res.sendfile(__dirname + '/test.html');
});
app.get('/index.css', function (req, res) {
 res.sendfile(__dirname + '/index.css');
});
app.get('/bootstrap.js', function (req, res) {
 res.sendfile(__dirname + '/ui-bootstrap-tpls-1.3.3.min.js');
});
app.get('/laby1.jpg', function (req, res) {
 res.sendfile(__dirname + '/laby1.jpg');
});
app.get('/pers.jpg', function (req, res) {
 res.sendfile(__dirname + '/pers.jpg');
});
app.get('/piece2.jpg', function (req, res) {
 res.sendfile(__dirname + '/piece2.jpg');
});
app.get('/monstre2.jpg', function (req, res) {
 res.sendfile(__dirname + '/monstre2.jpg');
});

var laby = labygenerator.generLaby();

httpServer.listen(1111);

var io = require('socket.io').listen(httpServer);

function addPeople(pseudo) {
  var i = Math.floor((Math.random() * tailleTableau) + 0);
  var j = Math.floor((Math.random() * tailleTableau) + 0);
  laby[i].listecase[j].info.listeJoueur.push(pseudo);
  return {'x':j,'y':i,'pseudo':pseudo};
}

io.sockets.on('connection', function (socket, pseudo) {
  var UsrPseudo;
  socket.on('nouveau_client', function(pseudo) {
    UsrPseudo = pseudo;
    var spawn = addPeople(pseudo);
    socket.emit('laby', laby);
    socket.broadcast.emit('nouveauJoueur', spawn);
  });
  socket.on('nouvellePiece', function(coord) {
    laby[coord.i].listecase[coord.j].info.Piece += 1;
    io.sockets.emit('nouvellePiece', coord);
  });
  socket.on('mouvUser', function(coord) {
    laby[coord.y].listecase[coord.x].info.listeJoueur.push(coord.pseudo);
    laby[coord.y].listecase[coord.x].info.Piece = 0;
    laby[coord.y].listecase[coord.x].info.Monstre = 0;
    laby[coord.i].listecase[coord.j].info.listeJoueur.splice(coord.pseudo, 1);
    socket.broadcast.emit('mouvUser', coord);
  })
  socket.on('nouveauMonstre', function(coord) {
    laby[coord.i].listecase[coord.j].info.Monstre += 1;
    io.sockets.emit('nouveauMonstre', coord);
  });
  socket.on('disconnect', function() {
    for (var i = 0; i < 25; i++) {
      for (var j = 0; j < 25; j++) {
        if (laby[i].listecase[j].info.listeJoueur != undefined)
        for (var k = 0; k < laby[i].listecase[j].info.listeJoueur.length; k++) {
          name = laby[i].listecase[j].info.listeJoueur[k];
          if (name == UsrPseudo)
          {
            laby[i].listecase[j].info.listeJoueur.splice(laby[i].listecase[j].info.listeJoueur.indexOf(UsrPseudo), 1);
          }
        }
      }
    }
    io.sockets.emit('delUser', UsrPseudo)
  })
});
