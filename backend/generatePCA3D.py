#########################
# NOTICE
# Check the file "generatePCA.py" for the detail explanation, as almost the code here is similar to the code in "generatePCA.py"
#########################

import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


def is_num_delimiter(s):
    # This function checks if a string is a number
    # It is used to identify the columns that contain non-numeric values
    # The reason we use s.replace(',', '') is that the data may contain comma as the decimal delimiter
    try:
        float(s.replace(',', ''))
    except ValueError:
        return False
    else:
        return True


bp = Blueprint('generatePCA3D', __name__)


@bp.route('/api/generate_pca_3d', methods=['POST'])
def generate_pca_3d():
    initialData = request.json
    convertedData = pd.DataFrame(data=initialData)

    non_numeric_columns = [col for col in convertedData.columns if not is_num_delimiter(
        convertedData[col].iloc[0])]
    if len(non_numeric_columns) > 1:
        convertedData.drop(non_numeric_columns[1:], axis=1, inplace=True)
    convertedData.set_index(non_numeric_columns[0], inplace=True)

    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    pcaObject = PCA(n_components=3)
    pcaData = pcaObject.fit_transform(dataAfterStandardization)

    pcaVariancePercentage = pcaObject.explained_variance_ratio_

    defaultColor = "#272E3F"
    defaultBorderColor = "#000000"
    defaultTitleFontColor = "#000000"

    pcaScatterCoordinates = [
        {
            'type': 'scatter3d',
            'mode': 'markers',
            'name': convertedData.columns[i],
            # In the PCA 2D, we use only x and y coordinates
            # In the PCA 3D, we use x, y, and z coordinates
            'x': [pcaData[i, 0]],
            'y': [pcaData[i, 1]],
            'z': [pcaData[i, 2]],
            'marker': {
                'size': 12,
                'color': defaultColor,
                'line': {
                    'color': defaultBorderColor,
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
                    'color': defaultTitleFontColor,
                },
            },
            'yaxis': {
                'title': f'PC2 ({pcaVariancePercentage[1]*100:.2f}%)',
                'titlefont': {
                    'size': 14,
                    'color': defaultTitleFontColor,
                },
            },
            'zaxis': {
                'title': f'PC3 ({pcaVariancePercentage[2]*100:.2f}%)',
                'titlefont': {
                    'size': 14,
                    'color': defaultTitleFontColor,
                },
            },
        }
    }

    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }

    return jsonify(result)
