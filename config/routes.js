// Definimos las rutas  - Miguel Angel Castaneda Jun 2023
require('dotenv').config();
const express = require('express');
const incidents = require('../modules/incidents');
const users = require('../modules/users');

const router = express.Router();


router.get(['/', '/health/ping'], (req, res) => {
  res.send({
    status: 200,
    message: `API Services up and running`
  });
});

//POST Crear un nuevo incidente
router.post("/api/incidents/", users.authorizeUser, incidents.createIncident);

//GET Traer todos los incidentes
router.get("/api/incidents/", users.authorizeUser, incidents.getAllIncidents);

//GET by id - Traer un incidente por id
router.get("/api/incidents/:id", users.authorizeUser, incidents.getIncidentById);

//PUT - Actualizar un incidente
router.put("/api/incidents/", users.authorizeUser, incidents.updateIncident);

//DELETE - Borrar un incidente
router.delete("/api/incidents/:id", users.authorizeUser, incidents.deleteIncident);

//POST - Crear un nuevo usuario
router.post("/api/users/signup", users.createUser);

//GET - Confirmar usuario
router.get("/api/users/confirm/:confirmationCode", users.confirmUser);


module.exports = router;
