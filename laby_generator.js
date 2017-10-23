function generLaby() {
  var laby = [];
  laby.push(pushItem(1, 10, "Bois", "bois.png"));
  return laby;
}

function pushItem(id, prix, nom, img) {
  return {
    id: id,
    prix: prix,
    name: nom,
    img: img
  };
}

module.exports.generLaby = generLaby;
