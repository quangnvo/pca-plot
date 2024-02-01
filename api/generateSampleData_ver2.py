import random as rd

import numpy as np
import pandas as pd
from flask import Blueprint

bp = Blueprint('generateSampleData_ver2', __name__)


@bp.route('/api/generate_data_ver2', methods=['GET'])
def generate_data():
    samples = ['sample' + str(i) for i in range(1, 101)]
    conditions = ['condition' + str(i) for i in range(1, 21)]

    data = pd.DataFrame(columns=conditions, index=samples)

    for sample in data.index:
        for condition in data.columns:
            data.loc[sample, condition] = np.random.poisson(
                lam=rd.randrange(10, 1000))

    return data.to_json(orient='split')
