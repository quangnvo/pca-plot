import matplotlib.colors as mcolors
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn import preprocessing
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generatePCA', __name__)


@bp.route('/api/generate_pca', methods=['POST'])
def generate_pca():
    generatedData = request.json

    # data = pd.DataFrame(data=generatedData['data'],
    #                     index=generatedData['index'], columns=generatedData['columns'])

    # data = pd.DataFrame(data=generatedData['data'],
    #                     index=generatedData['index'], columns=generatedData['columns'])

    data = pd.DataFrame(data=generatedData)

    # Drop the 'locus tag' column
    data = data.drop('locus tag', axis=1)

    # Replace commas with periods in the DataFrame
    data = data.replace(',', '.', regex=True)

    # Convert string values to float
    data = data.astype(float)

    # Remove rows with NaN values
    data = data.dropna()

    scaling = StandardScaler()
    dataAfterStandardization = scaling.fit_transform(data.T)

    pca = PCA()
    pcaData = pca.fit_transform(dataAfterStandardization)

    print("🚀🚀🚀")
    print("pcaData", pcaData)

    # Generate a color map with the same number of colors as columns
    cmap = plt.get_cmap('nipy_spectral')
    colors = [cmap(i) for i in np.linspace(0, 1, len(data.columns))]

    # Convert RGB colors to hex
    colors_hex = [mcolors.rgb2hex(color) for color in colors]

    # Create an array of scatter plot objects
    scatter_plots = [
        {
            'type': 'scatter',
            'mode': 'markers',
            'x': pcaData[:, i].tolist(),
            'y': pcaData[:, i+1].tolist() if i+1 < len(data.columns) else pcaData[:, i].tolist(),
            'marker': {
                'size': 12,
                'color': colors_hex[i],
                'line': {
                    'color': 'black',
                    'width': 2,
                }
            },
            'name': data.columns[i]
        } for i in range(len(data.columns))
    ]

    print("🧬🧬🧬")
    print(scatter_plots)

    # Prepare the result in the format that Plotly expects
    result = {
        'data': scatter_plots,
        'layout': {
            'title': {
                'text': 'PCA Plot',
                'font': {
                    'size': 30,
                    'color': 'black',
                },
            },
            'xaxis': {
                'title': 'PC1',
                'titlefont': {
                    'size': 20,
                    'color': 'black',
                },
            },
            'yaxis': {
                'title': 'PC2',
                'titlefont': {
                    'size': 20,
                    'color': 'black',
                },
            },
            'autosize': True,
            'hovermode': 'closest',
            'showlegend': True,
            'height': 400,
        }
    }

    return jsonify(result)
