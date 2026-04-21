const mongoose = require("mongoose");

const UtilisateurSchema = mongoose.Schema({
  nom: String,
  email: String,
  mot_passe: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Utilisateur = mongoose.model("utilisateur", UtilisateurSchema);
module.exports = Utilisateur;