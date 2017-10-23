var http = require("http");
var app = require('express')();
var express = require('express');
var labygenerator = require('./laby_generator.js');

httpServer = http.createServer(app);

app.get('/', function (req, res) {
 res.sendfile(__dirname + '/index.html');
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
app.use(express.static('img'));

var laby = labygenerator.generLaby();

httpServer.listen(1111);

var io = require('socket.io').listen(httpServer);
var marchand = {
  gold: 1000,
  inventaire: []
}

function addItem(transaction) {
  var fait = false;
  for (let i = 0; i < marchand.inventaire.length; i++) {
    if (marchand.inventaire[i].id == transaction.id) {
      marchand.inventaire[i].nb += transaction.nb;
      fait = true;
    }
    if (marchand.inventaire[i].nb <= 0) {
      marchand.inventaire.splice(i, 1);
    }
  }
  if (fait == false) {
    marchand.inventaire.push({
      id: transaction.id,
      nb: transaction.nb
    })
  }
}


io.sockets.on('connection', function (socket) {
  var UsrPseudo;
  socket.on('new_player', function (pseudo) {
    UsrPseudo = pseudo;
    socket.emit('listeItem', laby);
    socket.emit('marchand', marchand);
  });
  socket.on('transaction', function (transaction) {
    marchand.gold += transaction.gold;
    addItem(transaction);
    io.sockets.emit('transaction', transaction);
  })

  /*var UsrPseudo;
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
  })*/
});
