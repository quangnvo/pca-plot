import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generatePCA3D', __name__)


@bp.route('/api/generate_pca_3d', methods=['POST'])
def generate_pca_3d():
    initialData = request.json
    convertedData = pd.DataFrame(data=initialData)
    nameOfTheFirstColumn = list(initialData[0].keys())[0]
    convertedData.set_index(nameOfTheFirstColumn, inplace=True)
    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    pcaObject = PCA(n_components=3)
    pcaData = pcaObject.fit_transform(dataAfterStandardization)

    pcaVariancePercentage = pcaObject.explained_variance_ratio_

    pcaScatterCoordinates = [
        {
            'type': 'scatter3d',
            'mode': 'markers',
            'name': convertedData.columns[i],
            'x': [pcaData[i, 0]],
            'y': [pcaData[i, 1]],
            'z': [pcaData[i, 2]],
            'marker': {
                'size': 12,
                'color': "#272E3F",
                'line': {
                    'color': 'black',
                    'width': 2,
                }
            },
        } for i in range(len(convertedData.columns))
    ]

    layoutPCAPlotForReact = {
        'autosize': True,
        'hovermode': 'closest',
        'showlegend': True,
        'height': 1000,
        'scene': {
            'xaxis': {
                'title': f'PC1 ({pcaVariancePercentage[0]*100:.2f}%)',
                'titlefont': {
                    'size': 14,
                    'color': 'black',
                },
            },
            'yaxis': {
                'title': f'PC2 ({pcaVariancePercentage[1]*100:.2f}%)',
                'titlefont': {
                    'size': 14,
                    'color': 'black',
                },
            },
            'zaxis': {
                'title': f'PC3 ({pcaVariancePercentage[2]*100:.2f}%)',
                'titlefont': {
                    'size': 14,
                    'color': 'black',
                },
            },
        }
    }

    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }

    return jsonify(result)
