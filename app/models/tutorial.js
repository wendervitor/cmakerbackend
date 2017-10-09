var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TutorialSchema   = new Schema({
    img: {data: Buffer, contentType: String},
    name: String
});

module.exports = mongoose.model('Tutorial', TutorialSchema);