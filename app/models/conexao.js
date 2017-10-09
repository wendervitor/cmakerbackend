var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ConexaoSchema   = new Schema({
    categoria: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    tutoriais: [{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutorial'
    }]
});

module.exports = mongoose.model('Conexao', ConexaoSchema);
