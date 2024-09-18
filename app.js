require('dotenv').config();
const express = require('express');
const Minio = require('minio');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// MinIO Client Configuration
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

// Route for Home - List Buckets
app.get('/', async (req, res) => {
    try {
        const buckets = await minioClient.listBuckets();
        res.render('home', { buckets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching bucket list');
    }
});
app.get('/home', async (req, res) => {
    try {
        const buckets = await minioClient.listBuckets();
        res.render('home2', { buckets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching bucket list');
    }
});

// Route for Listing Objects in a Bucket
// Route for Listing Objects in a Bucket
app.get('/bucket/:bucketName', async (req, res) => {
    const bucketName = req.params.bucketName;
    const objectsList = [];
    const promises = [];

    try {
        // Create a stream to list objects
        const stream = minioClient.listObjectsV2(bucketName, '', true);
        stream.on('data', (obj) => {
            // Collect promises for presigned URLs
            promises.push(
                minioClient.presignedGetObject(bucketName, obj.name)
                    .then((presignedUrl) => {
                        objectsList.push({
                            ...obj,
                            presignedUrl
                        });
                    })
                    .catch((err) => {
                        console.error('Error generating presigned URL:', err);
                    })
            );
        });

        stream.on('end', async () => {
            try {
                // Wait for all presigned URL promises to complete
                await Promise.all(promises);
                res.render('bucket', { bucketName, objects: objectsList });
            } catch (err) {
                console.error('Error in processing objects:', err);
                res.status(500).send('Error processing objects');
            }
        });

        stream.on('error', (err) => {
            console.error('Error listing objects:', err);
            res.status(500).send('Error fetching objects');
        });
    } catch (err) {
        console.error('Error in bucket route:', err);
        res.status(500).send('Error fetching objects');
    }
});

app.get('/bucket2/:bucketName', async (req, res) => {
    const bucketName = req.params.bucketName;
    const objectsList = [];
    const promises = [];

    try {
        // Create a stream to list objects
        const stream = minioClient.listObjectsV2(bucketName, '', true);
        stream.on('data', (obj) => {
            // Collect promises for presigned URLs
            promises.push(
                minioClient.presignedGetObject(bucketName, obj.name)
                    .then((presignedUrl) => {
                        objectsList.push({
                            ...obj,
                            presignedUrl
                        });
                    })
                    .catch((err) => {
                        console.error('Error generating presigned URL:', err);
                    })
            );
        });

        stream.on('end', async () => {
            try {
                // Wait for all presigned URL promises to complete
                await Promise.all(promises);
                res.render('bucket2', { bucketName, objects: objectsList });
            } catch (err) {
                console.error('Error in processing objects:', err);
                res.status(500).send('Error processing objects');
            }
        });

        stream.on('error', (err) => {
            console.error('Error listing objects:', err);
            res.status(500).send('Error fetching objects');
        });
    } catch (err) {
        console.error('Error in bucket route:', err);
        res.status(500).send('Error fetching objects');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
