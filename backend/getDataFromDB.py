from io import BytesIO

import pandas as pd
from bson.json_util import ObjectId, dumps, loads
from flask import Blueprint, Response, jsonify, request
from pymongo import MongoClient

# Create a Blueprint for the generatePCA.py file
# The blueprint is used to define the route and will be added to the main app.py file
bp = Blueprint('getDataFromDB', __name__)

client = MongoClient()
db = client.test
visualizations = db.visualizations


@bp.route('/api/getDataFromDB', methods=['GET', 'POST'])
def getDataFromDB():
    print("!!!! already in getDataFromDB")

    # VERY IMPORTANT: the config number here must be in the JSON string format
    db_entry_id = ObjectId(loads('"65e84abc977b1859ace57211"'))
    print("db_entry_id ne: ", db_entry_id)
    db_entry = db.visualizations.find_one({"_id": db_entry_id})
    try:
        # Converts entry from .json into pandas parquet
        data = pd.read_parquet(
            BytesIO(db_entry['filtered_dataframe'])).to_json(orient='records')
    except:
        # The mockup db_entry stores the empty transformed_dataframe as a list, so don't convert that one.
        # Convert transformed into pandas parquet
        if type(db_entry['transformed_dataframe']) == bytes:
            data = pd.read_parquet(
                BytesIO(db_entry['transformed_dataframe'])).to_json(orient='records')
        else:
            data = db_entry['transformed_dataframe']
    return Response(data, mimetype="application/json")
