const Datastore = require('nedb');
const db = new Datastore({ filename: './data/notes.db', autoload: true });

module.exports.saveNote = function(note, callback) {
    db.update({_id: note._id }, note, {upsert: true} , function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

module.exports.getNote = function(id, currentUser, callback)
{
    db.findOne({ _id: id }, function (err, doc) {
        callback( err, doc);
    });
}

module.exports.getNotes = function(objFilter, objSort, callback) {
    db.find(objFilter).sort(objSort).exec(function (err, docs) {
        callback( err, docs);
    });
}



module.exports.getAllNotes = function(currentUser, callback) {
    db.find({}).sort({ finishDate: -1 }).exec(function (err, docs) {
        callback( err, docs);
    });
}




