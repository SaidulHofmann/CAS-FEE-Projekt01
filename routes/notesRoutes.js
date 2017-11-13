const express = require('express');
const router = express.Router();
const notesController = require('../controller/notesController.js');

router.get("/", notesController.getNotes);
router.post("/", notesController.saveNote);
router.get("/:id/", notesController.getNote);
router.delete("/:id/", notesController.deleteNote);

module.exports = router;