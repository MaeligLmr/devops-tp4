const mongoose = require("mongoose");

const CommandeSchema = mongoose.Schema({
  produits: {
    type: [String]
  },
  email_utilisateur: String,
  prix_total: Number,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});
Commande = mongoose.model("commande", CommandeSchema);
module.exports = Commande;