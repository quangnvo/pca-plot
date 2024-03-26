# --------------------------------
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to reach out to me at: voquang.usth@gmail.com
#
# --------------------------------

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


def is_number_or_not(s):
    # Check file "generatePCA.py" for the detail explanation
    try:
        if isinstance(s, str):
            s = s.replace(',', '')
        float(s)
    except ValueError:
        return False
    else:
        return True


@bp.route('/api/generate_scree_plot', methods=['POST'])
def generate_scree_plot():

    #########################
    # CODE SIMILAR TO "generatePCA.py"
    #########################
    initialData = request.json
    convertedData = pd.DataFrame(data=initialData)

    non_numeric_columns = [col for col in convertedData.columns if not is_number_or_not(
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

    # At here we can put the number of principal components that we want to generate
    # For example, if we want to generate 8 principal components, then we can put n_components=8
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
    # The cumsum() method returns a list of the cumulative sum of the elements in the array, and the obtained result will be like [52.5, 72.9, 85.1, 92.3, 97.2, 100.0]
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
        # This is the title of the plot, which will be displayed above the plot
        # If we want to display the title, just uncomment the following code
        # 'title': {
        #     'text': 'Scree Plot',
        #     'font': {
        #         'size': 30,
        #         'color': defaultTitleColor,
        #     },
        # },
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

    # Return the result in JSON format to frontend
    # Check the frontend file "frontend/app/page.js", at the function "generateScreePlot", to see how the frontend will receive the data and used it to generate the scree plot
    # In brief, in frontend, weuse <Plot> component from "react-plotly.js", and we put the "data" and "layout" which received from backend here into the <Plot> component, then the scree plot will be displayed
    result = {
        'data': screePlotFormatData,
        'layout': layoutScreePlotForReact
    }

    return jsonify(result)
