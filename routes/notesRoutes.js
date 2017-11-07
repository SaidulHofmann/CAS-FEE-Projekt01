const express = require('express');
const router = express.Router();
const notesController = require('../controller/notesController.js');

router.get("/", notesController.getNotes);
router.post("/", notesController.createNote);
// router.get("/:id/", notesController.showOrder);
// router.delete("/:id/", notesController.deleteOrder);

module.exports = router;