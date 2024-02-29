#########################
# NOTICE
# Check the file "generatePCA.py" for the detail explanation, as almost the code here is similar to the code in "generatePCA.py"
#########################

import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateScreePlot', __name__)


@bp.route('/api/generate_scree_plot', methods=['POST'])
def generate_scree_plot():

    #########################
    # CODE SIMILAR TO "generatePCA.py"
    #########################
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

    pcaObject = PCA(n_components=8)
    pcaObject.fit_transform(dataAfterStandardization)
    #########################
    # End of CODE SIMILAR TO "generatePCA.py"
    #########################

    # Get the percentage of variance of each principal component
    percentageOfVariance = np.round(
        pcaObject.explained_variance_ratio_ * 100, decimals=1)

    # Create the labels for the principal components, like "PC1", "PC2", etc.
    labels = ['PC' + str(x) for x in range(1, len(percentageOfVariance)+1)]

    # Get the cumulative variance
    # The cumsum() method returns a list of the cumulative sum of the elements in the array, and the result will be like [52.5, 72.9, 85.1, 92.3, 97.2, 100.0]
    cumulativeVariance = np.cumsum(percentageOfVariance)

    # Find the index where the cumulative variance exceeds 80%
    index_80 = next(i for i, v in enumerate(
        cumulativeVariance.tolist()) if v >= 80)

    # Default colors
    defaultColor = '#272E3F'
    defaultBorderColor = '#000000'
    defaultTitleColor = '#000000'

    # Create the data for the scree plot in Plotly format
    screePlotFormatData = [
        {
            'type': 'bar',
            'x': labels,
            'y': percentageOfVariance.tolist(),
            # Display the percentage on top of each bar
            # 'text': [f'{value}%' for value in percentageOfVariance.tolist()],
            'textposition': 'auto',
            'name': 'Individual',
            'marker': {
                'color': defaultColor,
                'line': {
                    'color': defaultBorderColor,
                    'width': 2,
                },
            },
        },
        {
            'type': 'scatter',
            'x': labels,
            'y': cumulativeVariance.tolist(),
            'mode': 'lines+markers',
            'name': 'Cumulative',
            'line': {
                'color': 'black',
                'width': 2,
            },
            'marker': {
                'size': 7,
            },
        }
    ]

    # Create the layout for the scree plot in Plotly format
    layoutScreePlotForReact = {
        'title': {
            # 'text': 'Scree Plot',
            'font': {
                'size': 30,
                'color': defaultTitleColor,
            },
        },
        'xaxis': {
            'title': 'Principal component',
            'titlefont': {
                'size': 20,
                'color': defaultTitleColor,
            },
        },
        'yaxis': {
            'title': 'Explained variance (%)',
            'titlefont': {
                'size': 20,
                'color': defaultTitleColor,
            },
        },
        'autosize': True,
        'hovermode': 'closest',
        'showlegend': False,
        'height': 400,
        # Add a dashed line at the 80% cumulative variance
        'shapes': [
            {
                'type': 'line',
                'xref': 'x',
                'yref': 'paper',
                'x0': labels[index_80],
                'y0': 0,
                'x1': labels[index_80],
                'y1': 1,
                'line': {
                    'color': 'black',
                    'width': 1,
                    'dash': 'dash',
                },
            }
        ]
    }

    result = {
        'data': screePlotFormatData,
        'layout': layoutScreePlotForReact
    }

    return jsonify(result)
