function addCase(i, j) {
  return {'info':{'Nord': 0, 'Sud': 0, 'Est': 0, 'Ouest': 0, 'listeJoueur': [], 'Piece': 0, 'Monstre': 0,'x':j,'y':i}};
}

var tailleTableau = 25;//à changer également dans save.js

function generLaby() {
  var laby = [];
  for (var i = 0; i < tailleTableau; i++) {
    laby.push({'listecase':[]});
    for (var j = 0; j < tailleTableau; j++) {
      laby[i].listecase.push(addCase(i, j));
    }
  }
  generChemin(laby);
  return laby;
}

var lifo;

function generChemin(laby) {
  var i = Math.floor((Math.random() * tailleTableau) + 0);
  var j = Math.floor((Math.random() * tailleTableau) + 0);
  lifo = [{'x':j,'y':i}];
  var nbcell = 1;
  var maxnbcell = tailleTableau * tailleTableau;
  while (nbcell < maxnbcell) {
    var listeNextCase = casesSuivantesPotentielles(i, j, laby);
    if (listeNextCase.length > 0) {
      var caseChoisis = choixCaseModifTableau(listeNextCase, laby);
      console.log(caseChoisis);
      lifo.push(caseChoisis);
      nbcell += 1;
    }else {
      lifo.pop();
    }
    i = lifo[lifo.length-1].y;
    j = lifo[lifo.length-1].x;
  }
}

function choixCaseModifTableau(listeNextCase, laby) {
  var nextCase = listeNextCase[Math.floor((Math.random() * listeNextCase.length) + 0)];
  if (nextCase.x == lifo[lifo.length-1].x + 1) {
    laby[nextCase.y].listecase[nextCase.x].info.Ouest = 1;
    laby[lifo[lifo.length-1].y].listecase[lifo[lifo.length-1].x].info.Est = 1;
  }
  if (nextCase.x == lifo[lifo.length-1].x - 1) {
    laby[nextCase.y].listecase[nextCase.x].info.Est = 1;
    laby[lifo[lifo.length-1].y].listecase[lifo[lifo.length-1].x].info.Ouest = 1;
  }
  if (nextCase.y == lifo[lifo.length-1].y + 1) {
    laby[nextCase.y].listecase[nextCase.x].info.Nord = 1;
    laby[lifo[lifo.length-1].y].listecase[lifo[lifo.length-1].x].info.Sud = 1;
  }
  if (nextCase.y == lifo[lifo.length-1].y - 1) {
    laby[nextCase.y].listecase[nextCase.x].info.Sud = 1;
    laby[lifo[lifo.length-1].y].listecase[lifo[lifo.length-1].x].info.Nord = 1;
  }
  return nextCase;
}

function casesSuivantesPotentielles(i, j, laby) {
  var listeCases = [];
  if (i+1 < tailleTableau && tousLesMurs(laby[(i + 1 )% tailleTableau].listecase[j])) {
    listeCases.push({'x':j,'y':(i + 1 )% tailleTableau});
  }
  if (i-1 >= 0 && tousLesMurs(laby[(i - 1 + tailleTableau )% tailleTableau].listecase[j])) {
    listeCases.push({'x':j,'y':(i - 1 + tailleTableau )% tailleTableau});
  }
  if (j+1 < tailleTableau && tousLesMurs(laby[i].listecase[(j + 1) % tailleTableau])) {
    listeCases.push({'x':(j + 1) % tailleTableau,'y':i});
  }
  if (j-1 >= 0 && tousLesMurs(laby[i].listecase[(j - 1 + tailleTableau) % tailleTableau])) {
    listeCases.push({'x':(j - 1 + tailleTableau) % tailleTableau,'y':i});
  }
  return listeCases;
}

function tousLesMurs(place) {
  if (place.info.Nord == 0 && place.info.Sud == 0 && place.info.Est == 0 && place.info.Ouest == 0) {
    return true;
  }
  return false;
}

module.exports.generLaby = generLaby;
