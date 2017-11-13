const store = require("../services/notesStore.js");
const util = require("../util/security");

module.exports.getNotes = function (req, res) {

    let queryFilter = null;
    if(req.query.email && req.query.isFinished) {
        queryFilter = { "createdBy" : req.query.email, "isFinished" : JSON.parse(req.query.isFinished)};
    }

    let querySort = null;
    if(req.query["order-by"] && req.query["order-direction"]) {
        querySort = { [req.query["order-by"]] : Number(req.query["order-direction"]) };
    }

    store.getNotes(queryFilter, querySort, function (err, notes) {
        res.json(notes || {});
    })
};

module.exports.saveNote = function (req, res) {
    let note = store.saveNote(req.body.note, function (err, newDoc) {
        res.json(newDoc);
    });
};

module.exports.getNote = function (req, res) {
    store.getNote(req.params.id, util.current(req), function (err, note) {
        res.json(note);
    });
};