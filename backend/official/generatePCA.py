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

    data = pd.DataFrame(data=generatedData)

    # Drop the first column
    data = data.drop(data.columns[0], axis=1)

    # Replace commas with periods in the DataFrame
    data = data.replace(',', '.', regex=True)

    # Convert string values to float
    data = data.astype(float)

    # Remove rows with NaN values
    data = data.dropna()

    #########################
    #
    # Standardize the data
    #
    #########################

    # Create a StandardScaler object
    standardScalerObject = StandardScaler()

    # Pass the data into the scaling object
    dataAfterStandardization = standardScalerObject.fit_transform(data.T)

    #########################
    #
    # Do the PCA
    #
    #########################

    # Create a PCA object
    pcaObject = PCA()

    # Pass the standardized data into the PCA object
    pcaData = pcaObject.fit_transform(dataAfterStandardization)

    #########################
    #
    # Check which one is the most contribute
    #
    #########################

    loading_scores = pd.Series(
        data=pca.components_[0],
        index=data.index
    )

    sorted_loading_scores = loading_scores.abs().sort_values(ascending=False)

    top_10_genes = sorted_loading_scores[0:10].index.values
    print("top 10 genes aaaaaa", loading_scores[top_10_genes])

    # Generate a color map with the same number of colors as columns
    # The color map can be found here (https://matplotlib.org/stable/users/explain/colors/colormaps.html)
    cmap = plt.get_cmap("hsv")
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
