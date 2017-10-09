var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategoriaSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
