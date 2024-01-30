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
    data = preprocessing.scale(data.T)

    # Create a PCA instance and name it pca
    pca = PCA()

    # The fit_transform method of pca apply the fit() and transform() methods to data
    pcaDataForDrawingPlot = pca.fit_transform(data)

    # Calculate the percentage of explained variance per principal component
    per_var = np.round(pca.explained_variance_ratio_ * 100, decimals=1)
    labels = ['PC' + str(x) for x in range(1, len(per_var)+1)]

    # Prepare the result in the format that Plotly expects
    result = {
        'data': [
            {
                'type': 'bar',
                'x': labels,
                'y': per_var.tolist(),
                # Display the percentage on top of each bar
                'text': [f'{value}%' for value in per_var.tolist()],
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
