var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cors       = require('cors');
var fs         = require('fs');
var formidable = require('formidable');

var Categoria  = require('./app/models/categoria');
var Conexao    = require('./app/models/conexao');
var Tutorial   = require('./app/models/tutorial');
var imgPath    = './uploads/teste.pdf';


//mongoose.connect('mongodb://localhost:27017/cmakerdb');
mongoose.connect('mongodb://heroku_qlx4cvd6@ds111565.mlab.com:11565/heroku_qlx4cvd6');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
//=========================================================================================================\\
var router = express.Router();              // get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    //res.json({ message: 'hooray! welcome to our api!' });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="tutorial" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('Nome: <input type="text" name="name"><br>');
    res.write('Categoria: <input type="text" name="categoria"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

//=========================================================================================================\\
router.route('/categoria')


    .post(function(req, res) {

        var categoria = new Categoria();
        categoria.name = req.body.name;

        categoria.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'categoria criada!' });
        });

    })

    .get(function(req, res) {
        Categoria.find(function(err, categorias) {
            if (err)
                res.send(err);

            res.json(categorias);
        });
    })

router.route('/categoria/:categoria_id')
    .get(function(req, res) {
        Categoria.findById(req.params.categoria_id, function(err, categoria) {
            if (err)
                res.send(err);
            res.json(categoria);
        });
    })

    .put(function(req, res) {
        Categoria.findById(req.params.categoria_id, function(err, categoria) {
            if (err) res.send(err);

            if(req.body.name != null){
              categoria.name = req.body.name;
              categoria.save(function(err) {
                    if (err) res.send(err);
                    res.json({ message: 'categoria updated!' });
              });
            }
        });
    })

    .delete(function(req, res) {
        Categoria.remove({
            _id: req.params.categoria_id
        }, function(err, categoria) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

//=========================================================================================================\\
//var a = new Tutorial();
router.route('/tutorial')


    .post(function(req, res) {
        var caminho='';
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          var oldpath = files.filetoupload.path;
          console.log(oldpath);
          //caminho = './uploads/'+ files.filetoupload.name;
          //var newpath = '/home/wender/Desktop/Cmaker_Web/uploads/' + files.filetoupload.name;
          console.log(caminho);
         // fs.rename(oldpath, newpath, function (err) {
            //if (err) throw err;
            var a = new Tutorial();
            a.name = fields.name;
            console.log(a.name);
            a.img.data = fs.readFileSync(files.filetoupload.path);
            a.img.contentType = 'application/pdf';
            a.save(function (err, a) {
              if (err) throw err;
              else{
                res.json('saved');
                console.error('saved to mongo');
                var conexao = new Conexao();
                conexao.categoria = fields.categoria;
                conexao.tutoriais = a.id;

                conexao.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Conexao criada!' });
                });
              }
            })
         });
    })

    .get(function(req, res, next) {

        /*Tutorial.findById('59cc2f1371ad860d27000001', function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });*/
        var ids = [];
        Tutorial.find(function(err, tutoriais) {
            if (err)
                res.send(err);
            for (i = 0; i < tutoriais.length; i++) {
                ids[i] = tutoriais[i].id;
            }
            res.json(tutoriais);
            //res.json(ids);
            //res.json(tutoriais[0].id);
        });
    })

    .delete(function(req, res) {
        Tutorial.remove({}, function(err, categoria) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/tutorial/:tutorial_id')

    .get(function(req,res){
        Tutorial.findById(req.params.tutorial_id, function(err, doc) {
            if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);;
        });
    })

    .delete(function(req, res) {
    Tutorial.remove({
            _id: req.params.tutorial_id
        }, function(err, categoria) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

//=========================================================================================================\\
router.route('/conexao')
    .post(function(req, res) {

        var conexao = new Conexao();
        conexao.categoria = req.body.categoria;
        conexao.tutoriais = req.body.tutoriais;

        conexao.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Conexao criada!' });
        });

    })

    .get(function(req, res) {
        Conexao.find({})
            .populate('categoria')
            .populate('tutoriais')
            .exec(function(error, posts) {
                res.json(posts);
                //console.log(JSON.stringify(posts, null, "\t"))
            })
    })

    .delete(function(req,res){
      Conexao.remove({}, function(err, conexao) {
          if (err) res.send(err);
          res.json({ message: 'Successfully deleted' });
      });
    });

router.route('/conexao/:categoria_id')

    .get(function(req,res){
        var names = [];
        Conexao.find({categoria: req.params.categoria_id})
            .populate('tutoriais')
            .exec(function(err, conexoes){
              for(i = 0 ;i < conexoes.length ; i++){
                names[i] = conexoes[i].tutoriais[0].name;
              }
            //res.json(names)
            res.json(conexoes);
            //res.json(conexoes[0].tutoriais[0].name);
        })
    });

//==================================================================================================================\\
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);
