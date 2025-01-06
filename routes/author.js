const express = require('express')

const router = express.Router(); 

const Author = require('../models/author')

const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
router.post('/register', upload.any('image'), (req, res) => {
    let data = req.body;
    let author = new Author(data); 
    author.image = filename;
    salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password, salt)
    author.save()
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

// login 
router.post('/login', (req, res) => {
    data = req.body; 
    Author.findOne({ email : data.email })
        .then(
            (author) => {
                let valid = bcrypt.compareSync(data.password , author.password)
                if (!valid){
                    res.status(401).send('email or password invalid')
                }else {
                      
                        payload = {
                                _id: author._id,
                                email: author.email,
                                fullname: author.name + ' '+ author.lastname
                        }
                        token = jwt.sign(payload , '123456') 
                        res.status(200).send({mytoken : token})
                }
            }
        )
        .catch(
            (err) => {
                res.send(err)
            }
        )

})

// all
router.get('/all', (req, res) => {
    Author.find({})
    .then(
        (authors) => {
            res.status(200).send(authors)
        }
    )
    .catch(
        (err) => {
            res.status(400).send(err)
        }
    )
})


// récupérer les auteurs avec pagination
router.get('/allPagin', async (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Valeurs par défaut : page 1, 5 auteurs par page
  
    try {
      const authors = await Author.find({})
        .skip((page - 1) * limit) // Ignorer les auteurs des pages précédentes
        .limit(parseInt(limit)) // Limiter les résultats
        .select('_id name lastname email about image'); // Inclure les champs nécessaires
  
      const totalAuthors = await Author.countDocuments(); // Nombre total d'auteurs
      res.status(200).json({
        authors,
        totalPages: Math.ceil(totalAuthors / limit),
        currentPage: parseInt(page),
      });
    } catch (err) {
      res.status(500).send({ error: 'Erreur lors de la récupération des auteurs.' });
    }
  });
  
// getbyid
router.get('/getbyid/:id', (req, res) => {
    id = req.params.id
    Author.find({ _id : id})
    .then(
        (author) => {
            res.status(200).send(author)
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
    Author.findByIdAndDelete({_id : id})
        .then(
            (author) => {
                res.status(200).send(author)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )
})


module.exports = router; 