import random as rd

import numpy as np
import pandas as pd
from flask import Blueprint

bp = Blueprint('generateSampleData', __name__)


@bp.route('/api/generate_data', methods=['GET'])
def generate_data():
    conditions = ['condition' + str(i) for i in range(1, 6)]
    samples = ['gene' + str(i) for i in range(1, 1001)]

    data = pd.DataFrame(columns=samples, index=conditions)

    for condition in data.index:
        data.loc[condition, 'gene1':'gene500'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=500)
        data.loc[condition, 'gene501':'gene1000'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=500)

    data = data.T

    return data.to_json(orient='split')
