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

    print("🚀🚀🚀")
    print(generatedData)

    data = pd.DataFrame(data=generatedData)

    print("🚀🚀🚀 data frameeeeeee")
    print(data)

    # Drop the 'locus tag' column
    data = data.drop('locus tag', axis=1)

    # Replace commas with periods in the DataFrame
    data = data.replace(',', '.', regex=True)

    # Convert string values to float
    data = data.astype(float)

    # Remove rows with NaN values
    data = data.dropna()

    print("🚀🚀🚀 data frameeeeeee sau khi làm tùm lum")
    print(data)

    scaling = StandardScaler()
    dataAfterStandardization = scaling.fit_transform(data.T)

    pca = PCA()
    pcaData = pca.fit_transform(dataAfterStandardization)

    # Generate a color map with the same number of colors as columns
    # The color map can be found here (https://matplotlib.org/stable/users/explain/colors/colormaps.html)
    cmap = plt.get_cmap("magma")
    colors = [cmap(i) for i in np.linspace(0, 1, len(data.columns))]
    # colors = [cmap(i) for i in range(len(data.columns))]


    # Convert RGB colors to hex
    colors_hex = [mcolors.rgb2hex(color[:3]) for color in colors]

    # Create an array of scatter plot objects
    scatter_plots = [
        {
            'type': 'scatter',
            'mode': 'markers',
            'x': [pcaData[i, 0]],
            'y': [pcaData[i, 1]],
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

    layoutPCAPlot = {
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

    # Prepare the result in the format that Plotly expects
    result = {
        'data': scatter_plots,
        'layout': layoutPCAPlot
    }

    return jsonify(result)
