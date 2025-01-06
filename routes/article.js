const express = require('express')

const router = express.Router(); 

const Article = require('../models/article')

const multer = require('multer')


filename = ''; 

const mystorage = multer.diskStorage({
    destination : './uploads',
    filename : (req, file, redirect) => {
        let date = Date.now(); 
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null , fl ) 
        filename = fl; 
    }

})
const upload = multer({storage: mystorage})


// post 
router.post('/ajout', upload.any('image'), (req, res) => {
    let data = req.body;
    let article = new Article(data); 
    article.date = new Date(); 
    article.image = filename; 
    article.tags = data.tags.split(',')

    article.save()
        .then(
            (saved) => {
                filename = ''
                res.status(200).send(saved);
            }
        )
        .catch(
            err => {
                res.status(400).send(err)
            }
        )

})

// getall 
router.get('/all', (req, res) => {
    Article.find({})
        .then(
            (articles) => {
                res.status(200).send(articles)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )
    
})

// getbyid
router.get('/getbyid/:id', (req, res) => {
    id = req.params.id
    Article.findOne({_id : id})
    .then(
        (articles) => {
            res.status(200).send(articles)
        }
    )
    .catch(
        (err) => {
            res.status(400).send(err)
        }
    )
})

// getbyidauthor
router.get('/getbyidauthor/:id', (req, res) => {
    id = req.params.id
    Article.find({ idAuthor : id})
    .then(
        (article) => {
            res.status(200).send(article)
        }
    )
    .catch(
        (err) => {
            res.status(400).send(err)
        }
    )
})

// delete
router.delete('/supprimer/:id', (req, res) => {
    id = req.params.id
    Article.findByIdAndDelete({_id : id})
        .then(
            (article) => {
                res.status(200).send(article)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )
})

// update 
router.put('/update/:id', upload.any('image'), (req, res) => {
    let id = req.params.id
    let data = req.body;
    data.tags = data.tags.split(',')

    

    if(filename.length>0){
        data.image = filename
    }
    Article.findByIdAndUpdate({_id : id}, data)
        .then(
            (article) => {
                filename ='';
                res.status(200).send(article)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )
})

// Ajouter un commentaire à un article
router.post('/comment/:id', (req, res) => {
    const articleId = req.params.id;
    const { idAuthor, content } = req.body;

    if (!idAuthor || !content) {
        return res.status(400).send('Author ID and comment content are required');
    }

    Article.findById(articleId)
        .then(article => {
            if (!article) {
                return res.status(404).send('Article not found');
            }

            // Ajouter le commentaire
            const newComment = {
                idAuthor: idAuthor,
                content: content,
            };

            article.comments.push(newComment);

            article.save()
                .then(updatedArticle => {
                    res.status(200).send(updatedArticle);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Récupérer tous les commentaires d'un article
router.get('/comments/:id', (req, res) => {
    const articleId = req.params.id;

    Article.findById(articleId)
        .populate('comments.idAuthor', 'name lastname')
        .then(article => {
            if (!article) {
                return res.status(404).send('Article not found');
            }

            res.status(200).send(article.comments);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});


module.exports = router; 