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

    # Separate the PCA data for 'wt' and 'ko' conditions
    wt_data = pcaDataForDrawingPlot[:5]
    ko_data = pcaDataForDrawingPlot[5:]

    # Prepare the result in the format that Plotly expects
    result = {
        'data': [
            {
                'type': 'scatter',
                'mode': 'markers',
                'x': wt_data[:, 0].tolist(),
                'y': wt_data[:, 1].tolist(),
                'text': generatedData['columns'][:5],
                'marker': {
                    'size': 12,
                    'color': 'blue'
                },
                'name': 'wt'
            },
            {
                'type': 'scatter',
                'mode': 'markers',
                'x': ko_data[:, 0].tolist(),
                'y': ko_data[:, 1].tolist(),
                'text': generatedData['columns'][5:],
                'marker': {
                    'size': 12,
                    'color': 'red'
                },
                'name': 'ko'
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
