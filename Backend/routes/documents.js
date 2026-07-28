const express = require('express');
const router = express.Router();
const Document = require('../models/Document');


router.get('/', async (req, res) => {
    try {
       
        const documents = await Document.find({}).select('document_name category');

       
        const categories = {};
        documents.forEach(doc => {
            const cat = doc.category;
            if (!categories[cat]) {
                categories[cat] = [];
            }
            categories[cat].push({
                title: doc.document_name,
                _id: doc._id
            });
        });

        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/search', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();

        if (!q) {
            return res.json([]);
        }

       
        const regex = new RegExp(q, 'i');
        const results = await Document.find({
            $or: [
                { document_name: regex },
                { category: regex },
                { description: regex }
            ]
        }).select('document_name category description').limit(20);

        res.json(results.map(doc => ({
            _id: doc._id,
            title: doc.document_name,
            category: doc.category,
            description: doc.description
        })));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        // Find one document by its MongoDB ID
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        res.json(document);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
