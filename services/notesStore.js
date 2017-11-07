const Datastore = require('nedb');
const db = new Datastore({ filename: './data/notes.db', autoload: true });
// const coreTypes = require('../public/javascripts/services/coreTypes.js');


module.exports.getAllNotes = function(currentUser, callback) {
    db.find({createdBy : currentUser}).sort({ finishDate: -1 }).exec(function (err, docs) {
        callback( err, docs);
    });
}

module.exports.saveNote = function(note, callback) {
    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}