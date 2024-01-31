import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn import preprocessing
from sklearn.decomposition import PCA

bp = Blueprint('generateScreePlot', __name__)


@bp.route('/api/generate_scree_plot', methods=['POST'])
def generate_scree_plot():
    generatedData = request.json

    data = pd.DataFrame(data=generatedData['data'],
                        index=generatedData['index'], columns=generatedData['columns'])

    # preprocessing.scale() will do the standardization for the data, as PCA is sensitive to the scale of the data.
    # If one feature has a large variance and another has a small variance, the PCA might load heavily on the feature with large variance, so it may lead to the bias result.
    dataAfterStandardization = preprocessing.scale(data.T)

    # Create a PCA instance and name it pcaModel
    # pcaModel now is still an empty model
    pcaModel = PCA()

    # Add the dataAfterStandardization to the pcaModel, meanwhile use the fit_transform() method to fit the model with data and apply the dimensionality reduction on data.
    pcaModel.fit_transform(dataAfterStandardization)

    # Calculate the percentage of explained variance per principal component
    percentageOfVariance = np.round(
        pcaModel.explained_variance_ratio_ * 100, decimals=1)

    # Create labels for the scree plot, like "PC1", "PC2", etc.
    labels = ['PC' + str(x) for x in range(1, len(percentageOfVariance)+1)]

    # Prepare the result in the format that Plotly expects
    result = {
        'data': [
            {
                'type': 'bar',
                'x': labels,
                'y': percentageOfVariance.tolist(),
                # Display the percentage on top of each bar
                'text': [f'{value}%' for value in percentageOfVariance.tolist()],
                'textposition': 'auto',
                'marker': {
                    'color': 'yellow',
                    'line': {
                        'color': 'black',
                        'width': 2,
                    },
                }
            }
        ],
        'layout': {
            'title': {
                'text': 'Scree Plot',
                'font': {
                    'size': 30,
                    'color': 'black',
                },
            },
            'xaxis': {
                'title': 'Principal component',
                'titlefont': {
                    'size': 20,
                    'color': 'black',
                },
            },
            'yaxis': {
                'title': 'Explained variance (%)',
                'titlefont': {
                    'size': 20,
                    'color': 'black',
                },
            },
            'autosize': True,
            'hovermode': 'closest',
            'showlegend': False,
            'height': 400,
        }
    }

    return jsonify(result)
