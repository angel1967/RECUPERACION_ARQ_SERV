/* eslint-disable no-param-reassign */
const logger = require('../lib/logger')('incidents'); // Module Name Required
const Incident = require('../models/incident');


const createIncident = async (req, res) => {
    try {
        const incidentData = req.body; // Read incident data from the body
        await Incident.create(incidentData) // Create a new incident in the database
            .then((createdIncident) => {
                logger.info(`[createIncident] Incident created with id: ${createdIncident._id}`);
                res.status(200)
                    .json({
                        success: true,
                        createdIncident
                    })
            })
            .catch((error) => {
                logger.error(`[createIncident] Incident could not be created. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[createIncident] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}



const getAllIncidents = async (req, res) => {
    try {
        await Incident.find() //Get all incidents from database
            .then((allIncidents) => {
                logger.info(`[getAllIncidents] All incidents retrieved`);
                res.status(200)
                    .json({
                        success: true,
                        allIncidents
                    })
            })
            .catch((error) => {
                logger.error(`[getAllIncidents] Incidents could not be retrieved. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[getAllIncidents] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}

const getIncidentById = async (req, res) => {
    try {
        let incidentId = req.params.id; // Read incident id from query params
        await Incident.findById(incidentId) // Find the incident in the database
            .then((incident) => {
                logger.info(`[getIncidentById] Incident retrieved with id: ${incidentId}`);
                res.status(200)
                    .json({
                        success: true,
                        incident
                    })
            })
            .catch((error) => {
                logger.error(`[getIncidentById] Incident could not be retrieved. ${error.message}`);
                res.status(404)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[readIncidents] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}


const updateIncident = async (req, res) => {
    try {
        let incidentData = req.body; // Read incident data from the body
        await Incident.findByIdAndUpdate(incidentData._id, incidentData) // Update incident in the database
            .then((updatedIncident) => {
                logger.info(`[updateIncident] Incident updated with id: ${incidentData._id}`);
                res.status(200)
                    .json({
                        success: true,
                        incidentData
                    })
            })
            .catch((error) => {
                logger.error(`[updateIncident] Incident could not be updated. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[updateIncident] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}

const deleteIncident = async (req, res) => {
    try {
        let incidentId = req.params.id; // Read incident id from query params
        await Incident.findByIdAndDelete(incidentId) // Delete an incident from the database
            .then((deletedIncident) => {
                logger.info(`[deleteIncident] Incident deleted with id: ${incidentId}`);
                res.status(200)
                    .json({
                        success: true,
                        deletedIncident
                    })
            })
            .catch((error) => {
                logger.error(`[deleteIncident] Incident could not be deleted. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[deleteIncident] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}

module.exports = {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident
}