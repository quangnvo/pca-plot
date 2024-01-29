import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn import preprocessing
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateScreePlot', __name__)


@bp.route('/api/generate_scree_plot', methods=['POST'])
def generate_scree_plot():
    generatedData = request.json

    data = pd.DataFrame(data=generatedData['data'],
                        index=generatedData['index'], columns=generatedData['columns'])

    data = preprocessing.scale(data.T)

    pca = PCA()
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
                'textposition': 'auto',  # Position the text on top of each bar
                'marker': {
                    'color': 'lightblue',
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
