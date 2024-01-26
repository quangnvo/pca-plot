import random as rd

import numpy as np
import pandas as pd
from flask import Blueprint

bp = Blueprint('generateSampleData', __name__)


@bp.route('/api/generate_data', methods=['GET'])
def generate_data():
    genes = ['gene' + str(i) for i in range(1, 101)]
    wt = ['wt' + str(i) for i in range(1, 6)]
    ko = ['ko' + str(i) for i in range(1, 6)]

    # Use * to unpack the lists
    # If not using *, it will be [['wt1', 'wt2', 'wt3','wt4',,'wt5'], ['ko1', 'ko2', 'ko3', 'ko4', 'ko5']]
    # But we want ['wt1', 'wt2', 'wt3', 'wt4', 'wt5', 'ko1', 'ko2', 'ko3', 'ko4', 'ko5']
    data = pd.DataFrame(columns=[*wt, *ko], index=genes)

    for gene in data.index:
        data.loc[gene, 'wt1':'wt5'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=5)
        data.loc[gene, 'ko1':'ko5'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=5)

    return data.to_json(orient='split')
