const express = require('express');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const Article = require('../models/articlesModel.js');
const config = require('../config.js');

let router = express.Router();

const checkForErrors = ({ title, author, body }) => {
    let errors = {};
    let isValid = false;
    if (title === '') {
        errors = { ...errors, title: 'This field is required' }
    }
    if (author === '') {
        errors = { ...errors, author: 'This field is required' }
    }
    if (body === '') {
        errors = { ...errors, body: 'This field is required' }
    }

    if (Object.keys(errors).length > 0) {
        return { isValid, errors };
    }
    isValid = true;
    return { isValid, errors };
}

const isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const authorizationToken = authorizationHeader.split(' ')[1];
    if (authorizationToken) {
        jwt.verify(authorizationToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Failed to authenticate' });
            } else {
                req.authorId = decoded.id;
                next();
            }
        });
    } else {
        res.status(403).json({ error: 'No token provided' })
    }
}


/***************************get articles*********************************/
router.get("/search/:search", (req, res) => {
    console.log(req.params.search);
    if (req.params.search != 'none') {
        console.log("WITH SEARCH");
        console.log(req.params.search);
        const regex = new RegExp(escapeRegex(req.params.search), 'gi');
        Article.find({ "title": regex }, (err, articles) => {
            console.log(articles);
                        res.json({ articles });

        })
    } else {
        "NO SEARCH"
        Article.find({}, (err, articles) => {
            res.json({ articles });
        })
    }
});

router.get('/myarticles', isAuthenticated, (req, res) => {
    Article.find({ authorId: req.authorId }, (err, articles) => {
        if (err) throw err;
        res.json({ articles });
    })
});

/***************************add new article*********************************/
router.post('/add', isAuthenticated, (req, res) => {
    const title = req.body.title || '';
    const author = req.body.author || '';
    const body = req.body.body || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ title, author, body });

    if (isValid) {
        const newArticle = new Article({
            title: title,
            author: author,
            body: body,
            authorId: new ObjectId(authorId)
        });

        newArticle.save((err) => {
            if (err) throw err;
            else {
                res.json({ success: 'success' });
            }
        });
    } else {
        res.json({ errors });
    }
});
/***************************edit article*********************************/
router.post('/edit/:id', isAuthenticated, (req, res) => {
    const title = req.body.title || '';
    const author = req.body.author || '';
    const body = req.body.body || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ title, author, body });

    if (isValid) {
        const updatedArticle = {
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            authorId: new ObjectId(authorId)
        };

        Article.findByIdAndUpdate(req.params.id, updatedArticle, err => {
            if (err) throw err;
            else res.json({ success: 'success' });
        });
    } else {
        res.json({ errors });
    }
});
/***************************delete article*********************************/
router.delete('/delete/:id', isAuthenticated, (req, res) => {
    Article.remove({ _id: req.params.id }, err => {
        res.json({ success: 'success' });
    });
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};









router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) throw err;
        res.json({ article });
    })
});



module.exports = router;
