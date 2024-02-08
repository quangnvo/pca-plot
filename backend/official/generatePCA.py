import matplotlib.colors as mcolors
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generatePCA', __name__)


@bp.route('/api/generate_pca', methods=['POST'])
def generate_pca():
    # Get the data from the request
    initialData = request.json

    # Convert the data into a DataFrame
    convertedData = pd.DataFrame(data=initialData)

    # Drop the first column of the DataFrame
    # convertedData = convertedData.drop(convertedData.columns[0], axis=1)

    # index_col_name = initialData[0].keys()[0]
    # print("index_col_name 🚀🚀🚀", index_col_name)
    convertedData.set_index("geneName", inplace=True)

    # Three things done here:
    # 1. Replace commas with periods in the DataFrame
    # 2. Convert string values to float
    # 3. Remove rows with NaN values
    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    #########################
    # Standardize the data
    #########################

    # Two things done here:
    # 1. Create a StandardScaler object
    # 2. Pass the data into the scaling object
    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    #########################
    # Do the PCA
    #########################

    # Two things done here:
    # 1. Create a PCA object
    # 2. Pass the standardized data into the PCA object
    pcaObject = PCA()
    pcaData = pcaObject.fit_transform(dataAfterStandardization)

    print("pcaData ❗❗❗", pcaData)

    #########################
    # Check which one is the most contribute
    #########################

    # loading_scores = pd.Series(
    #     data=pca.components_[0],
    #     index=data.index
    # )
    # sorted_loading_scores = loading_scores.abs().sort_values(ascending=False)
    # top_10_genes = sorted_loading_scores[0:10].index.values
    # print("top 10 genes aaaaaa", loading_scores[top_10_genes])

    #########################
    # Generate the color map
    #########################

    # The color map can be found here:
    # (https://matplotlib.org/stable/users/explain/colors/colormaps.html)
    cmap = plt.get_cmap("hsv")
    colors = [cmap(i) for i in np.linspace(0, 1, len(convertedData.columns))]

    # Convert RGB colors to hex
    colors_hex = [mcolors.rgb2hex(color[:3]) for color in colors]

    #########################
    # Prepare the result for Plotly
    #########################
    pcaScatterCoordinates = [
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
            'name': convertedData.columns[i]
        } for i in range(len(convertedData.columns))
    ]

    layoutPCAPlotForReact = {
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

    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }

    #########################
    # Return the result
    #########################
    return jsonify(result)
