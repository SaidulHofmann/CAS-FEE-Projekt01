const store = require("../services/notesStore.js");
const util = require("../util/security");

module.exports.getNotes = function(req, res)
{
    store.getAllNotes(util.current(req), function (err, orders) {
        res.json(orders || {});
    })
};

module.exports.createNote = function(req, res) {
    let note = store.saveNote(req.body.note, function(err, newDoc) {
        res.json(newDoc);
    });
};