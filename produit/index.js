const express = require("express");
const app = express();
const PORT = process.env.PORT_PRODUIT || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.connect(process.env.MONGO_URI_PRODUIT)
  .then(() => console.log("Produit-Service DB Connected"))
  .catch(err => console.error("Erreur de connexion :", err));

// POST : Ajouter un produit
app.post("/produit/ajouter", isAuthenticated, (req, res) => {
  const { nom, description, prix } = req.body;
  const newProduit = new Produit({ nom, description, prix });

  newProduit.save()
    .then(produit => res.status(201).json(produit))
    .catch(error => res.status(400).json({ error }));
});

// GET : Acheter (chercher par ids)
app.get("/produit/acheter", isAuthenticated, (req, res) => {
  const { ids } = req.body;
  Produit.find({ _id: { $in: ids } })
    .then(produits => res.status(201).json(produits))
    .catch(error => res.status(400).json({ error }));
});

app.listen(PORT, () => {
  console.log(`Product-Service at ${PORT}`);
});