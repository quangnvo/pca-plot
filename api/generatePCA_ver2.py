import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn import preprocessing
from sklearn.decomposition import PCA

bp = Blueprint('generatePCA_ver2', __name__)


@bp.route('/api/generate_pca_ver2', methods=['POST'])
def generate_pca():
    generatedData = request.json

    data = pd.DataFrame(data=generatedData['data'],
                        index=generatedData['index'], columns=generatedData['columns'])

    # Scale the data
    data = preprocessing.scale(data)

    # Perform PCA
    pca = PCA()
    pcaDataForDrawingPlot = pca.fit_transform(data)

    # Prepare the result in the format that Plotly expects
    result = {
        'data': [
            {
                'type': 'scatter',
                'mode': 'markers',
                'x': pcaDataForDrawingPlot[:, 0].tolist(),
                'y': pcaDataForDrawingPlot[:, 1].tolist(),
                'text': generatedData['index'],
                'marker': {
                    'size': 12,
                    'color': 'blue',
                    'line': {
                        'color': 'black',
                        'width': 2,
                    }
                },
                'name': 'Data'
            }
        ],
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
