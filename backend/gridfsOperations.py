import gridfs
from pymongo import MongoClient


def get_db():
    # Create a connection to MongoDB
    client = MongoClient(
        'mongodb://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority')

    # Select database
    db = client['myDB']

    return db


def save_file_to_gridfs(db, filename):
    # Create a GridFS object
    fs = gridfs.GridFS(db)

    # Open file in binary mode
    with open(filename, 'rb') as f:
        # Save the file in GridFS
        file_id = fs.put(f, filename=filename)

    return file_id


def get_file_from_gridfs(db, file_id):
    # Create a GridFS object
    fs = gridfs.GridFS(db)

    # Now the file is saved in GridFS, we can access it
    file = fs.get(file_id)
    return file
