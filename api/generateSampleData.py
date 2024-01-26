import random as rd

import numpy as np
import pandas as pd
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/generate_data', methods=['GET'])
def generate_data():
    genes = ['gene' + str(i) for i in range(1, 101)]
    wt = ['wt' + str(i) for i in range(1, 6)]
    ko = ['ko' + str(i) for i in range(1, 6)]
    data = pd.DataFrame(columns=[*wt, *ko], index=genes)

    print(genes)
    print("**************")
    print(wt)
    print("**************")
    print(ko)
    print("**************")
    print(data)
    print("**************")

    for gene in data.index:
        data.loc[gene, 'wt1':'wt5'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=5)
        data.loc[gene, 'ko1':'ko5'] = np.random.poisson(
            lam=rd.randrange(10, 1000), size=5)
    return data.to_json(orient='split')


generate_data()
