const express = require("express");
const app = express();
const PORT = process.env.PORT_COMMANDE || 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.connect(process.env.MONGO_URI_COMMANDE)
  .then(() => console.log("Commande-Service DB Connected"))
  .catch(err => console.error("Erreur de connexion :", err));

// Calcul du prix total
function prixTotal(produits) {
  let total = 0;
  for (let i = 0; i < produits.length; i++) {
    total += produits[i].prix;
  }
  return total;
}

// Appel HTTP vers produit-service
async function httpRequest(ids, token) {
  try {
    const response = await axios.get("http://produit-service:4000/produit/acheter", {
      data: { ids },
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ← on transmet le token
      }
    });
    return prixTotal(response.data);
  } catch (error) {
    console.error(error);
  }
}

// POST : Ajouter une commande
app.post("/commande/ajouter", isAuthenticated, async (req, res) => {
  const { ids } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1]; // ← récupère le token

  httpRequest(ids, token).then(total => {
    const newCommande = new Commande({
      produits: ids,
      email_utilisateur: req.user.email,
      prix_total: total,
    });

    newCommande.save().then(commande => {
      res.status(201).json(commande);
    }).catch(error => res.status(400).json({ error }));
  });
});

app.listen(PORT, () => {
  console.log(`Commande-Service at ${PORT}`);
});