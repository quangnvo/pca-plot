import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateLoadingsPlot', __name__)


@bp.route('/api/generate_loadings_plot', methods=['POST'])
def generate_scree_plot():
    #########################
    # Get the initial data and do some initial preparation
    #########################

    # Two things done in the following code:
    # 1. Get the data from the request
    # 2. Convert the data into a DataFrame
    initialData = request.json
    convertedData = pd.DataFrame(data=initialData)

    # Assume that the first column is the column that contains the names of the genes (like gene1, gene2, etc.), so here we set the first column as the index of the DataFrame
    # ==> so the Dataframe will not use it for the calculations
    # Two things done in the following code:
    # 1. Take the name of the first column in the DataFrame
    # 2. Based on that name, let the first column be the index of the DataFrame
    nameOfTheFirstColumn = list(initialData[0].keys())[0]
    convertedData.set_index(nameOfTheFirstColumn, inplace=True)

    # Three things done in the following code:
    # 1. Replace comma with dot in the DataFrame
    # 2. Convert string values to float
    # 3. Remove rows with NaN values
    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    #########################
    # Standardize the data
    #########################

    # Two things done in the following code:
    # 1. Create a StandardScaler object by using StandardScaler() of scikit-learn
    # 2. Pass the data into the scaling object ==> data will be standardized
    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    #########################
    # Do the PCA
    #########################

    # Two things done in the following code:
    # 1. Create a PCA object by using PCA() of scikit-learn
    # 2. Pass the standardized data into the PCA object
    pcaObject = PCA()
    pcaObject.fit_transform(dataAfterStandardization)

    # Calculate the percentage of explained variance per principal component
    percentageOfVariance = np.round(
        pcaObject.explained_variance_ratio_ * 100, decimals=1)

    #########################
    # Prepare the result following the Plotly format
    #########################

    # Four things done in the following code:
    # 1. Create labels for the scree plot, like "PC1", "PC2", etc.
    # 2. Prepare the data for the scree plot
    # 3. Prepare the layout for the scree plot
    # 4. Combine the data and the layout into a dictionary and return it as a JSON object

    labels = ['PC' + str(x) for x in range(1, len(percentageOfVariance)+1)]

    screePlotFormatData = [
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
    ]

    layoutScreePlotForReact = {
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

    result = {
        'data': screePlotFormatData,
        'layout': layoutScreePlotForReact
    }

    return jsonify(result)
