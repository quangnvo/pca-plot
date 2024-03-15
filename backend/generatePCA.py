import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Create a Blueprint for the generatePCA.py file
# The blueprint is used to define the route and will be added to the main file app.py
bp = Blueprint('generatePCA', __name__)


def is_number_or_not(s):
    # This "is_number_or_not" function checks if a string is a number
    # The name "is_number_or_not" is not really a nice name for this function, but "is_number" is a function already built-in in Python, and the "is_number" only check the number with dot ".", so the comma "," will not be recognized as a number.
    # That's why we use "is_number_or_not", in which we use s.replace(',', '') to handle the data that may contain comma as the decimal delimiter
    # This function is used to identify the columns that contain non-numeric values
    try:
        # If the value is a string, then replace the comma with an empty string, then check if it is a number
        if isinstance(s, str):
            s = s.replace(',', '')
        # If the value is already a number, then convert it to a float
        float(s)
    except ValueError:
        return False
    else:
        return True


@bp.route('/api/generate_pca', methods=['POST'])
def generate_pca():
    #########################
    # GET INITIAL DATA, DO INITIAL PREPARATIONS
    #########################
    # Get the data from the request
    initialData = request.json
    # Convert the data into a DataFrame
    convertedData = pd.DataFrame(data=initialData)

    # Identify columns in the first row that contain non-numeric values
    non_numeric_columns = [col for col in convertedData.columns if not is_number_or_not(
        convertedData[col].iloc[0])]

    # If there are more than one non-numeric columns, drop all but the first one
    if len(non_numeric_columns) > 1:
        convertedData.drop(non_numeric_columns[1:], axis=1, inplace=True)

    # Set the first non-numeric column as the index of the DataFrame
    convertedData.set_index(non_numeric_columns[0], inplace=True)

    # Replace comma with dot in the DataFrame
    convertedData = convertedData.replace(',', '.', regex=True)
    # Convert string values to float
    convertedData = convertedData.astype(float)
    # Remove rows with NaN values
    convertedData = convertedData.dropna()
    #########################
    # End of GET INITIAL DATA, DO INITIAL PREPARATIONS
    #########################

    #########################
    # STANDARDIZE THE DATA
    #########################
    # Create a StandardScaler object by using StandardScaler() of scikit-learn
    standardScalerObject = StandardScaler()
    # Pass the data into the scaling object ==> data will be standardized
    # The data is transposed because the StandardScaler object expects the data to be in the form of [n_samples, n_features].
    # Samples (rows) are like "H2O_30m_A", "H2O_30m_B", etc., and features (columns) are like "gene1", "gene2", etc.
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)
    #########################
    # End of STANDARDIZE THE DATA
    #########################

    #########################
    # DO THE PCA
    #########################
    # Create a PCA object by using PCA() of scikit-learn
    pcaObject = PCA()
    # Then pass the standardized data into the PCA object
    pcaData = pcaObject.fit_transform(dataAfterStandardization)
    # Get the variance percentage of each principal component
    pcaVariancePercentage = pcaObject.explained_variance_ratio_
    #########################
    # End of DO THE PCA
    #########################

    #########################
    # PREPARE THE RESULT, FOLLOWED BY THE FORMAT OF PLOTLY
    #########################

    # The default colors of the points in the PCA plot
    defaultColor = "#272E3F"
    defaultBorderColor = "#000000"
    defaultTileFontColor = "#000000"

    # Prepare the data for the PCA plot
    pcaScatterCoordinates = [
        {
            'type': 'scatter',
            'mode': 'markers',
            'name': convertedData.columns[i],
            'x': [pcaData[i, 0]],
            'y': [pcaData[i, 1]],
            'marker': {
                'size': 12,
                "color": defaultColor,
                # This is the color of the border of the points
                'line': {
                    'color': defaultBorderColor,
                    'width': 2,
                }
            },
        } for i in range(len(convertedData.columns))
    ]

    # Prepare the layout for the PCA plot
    layoutPCAPlotForReact = {
        # The title of the plot, which will be displayed above the plot
        # 'title': {
        #     'text': 'PCA Plot',
        #     'font': {
        #         'size': 30,
        #         'color': defaultTileFontColor,
        #     },
        # },
        'xaxis': {
            # This will show the title of the x-axis with the % of variance, like "PC1 (74.19%)"
            'title': f'PC1 ({pcaVariancePercentage[0]*100:.2f}%)',
            'titlefont': {
                'size': 20,
                'color': defaultTileFontColor,
            },
        },
        'yaxis': {
            'title': f'PC2 ({pcaVariancePercentage[1]*100:.2f}%)',
            'titlefont': {
                'size': 20,
                'color': defaultTileFontColor,
            },
        },
        'autosize': True,
        # There are other options for hovermode, such as 'x', 'y', 'x unified'
        # The 'closest' option means that the hover label will be placed at the closest point among all the traces
        # Other options can be found here: https://plotly.com/python/hover-text-and-formatting/
        'hovermode': 'closest',
        'showlegend': True,
        'height': 400,
    }

    # Combine the data and the layout into a dictionary and return it as a JSON object
    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }
    #########################
    # End of PREPARE THE DATA, FOLLOWED BY THE FORMAT OF PLOTLY
    #########################

    # Return the result as a JSON object
    return jsonify(result)
