from io import BytesIO

import pandas as pd
from bson.json_util import ObjectId, loads
from flask import Blueprint, Response, request
from pymongo import MongoClient

# Create a Blueprint for the generatePCA.py file
# The blueprint is used to define the route and will be added to the main app.py file
bp = Blueprint('getDataFromDB', __name__)

client = MongoClient()
db = client.test
visualizations = db.visualizations


@bp.route('/api/getDataFromDB', methods=['GET', 'POST'])
def getDataFromDB():
    configNumber = request.json['config']

    if configNumber != "undefined":
        # VERY IMPORTANT: the config number here must be in the JSON string format, so we need to put it as f'"{configNumber}"'
        # For example, it should be like '"123123123"', with double quotes and single quotes
        db_entry_id = ObjectId(loads(f'"{configNumber}"'))
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
