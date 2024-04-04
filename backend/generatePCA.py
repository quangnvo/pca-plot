# --------------------------------
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to contact me at: voquang.usth@gmail.com
#
# --------------------------------

import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Create a Blueprint for the generatePCA.py file
# The blueprint is used to define the route and will be added to the main file "app.py"
bp = Blueprint('generatePCA', __name__)


def is_number_or_not(s):
    # This "is_number_or_not()" function checks if a string is a number
    # Actually, there is a function called "is_number()" from pandas, but the "is_number()" only check number with dot as the decimal delimiter but not with comma
    # ==> for example, "1.33" is considered as a number by "is_number()" but "1,33" is not
    # That's why we have "is_number_or_not()", in which we use s.replace(',', '') to handle the data that may contain comma as the decimal delimiter
    # This function is then used to identify which columns contain non-numeric value
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
    # Get the data from the request, which means from the frontend
    # The data is sent from the frontend as a JSON object
    # While reading here, read the file "frontend/app/page.js", at the function "generatePCAPlot()" to see how the data is sent to the backend here
    initialData = request.json
    # Then convert the data into a DataFrame
    convertedData = pd.DataFrame(data=initialData)

    # Identify columns in the first row that contain non-numeric values
    # For example, if the data like this:
    # |-----------|-----------|-----------|-----------|-------------|-------------|
    # | locus_tag |  name     | H2O_30m_A | H2O_30m_B | PNA79_30m_A | PNA79_30m_B |
    # |-----------|-----------|-----------|-----------|-------------|-------------|
    # | gene_1    |  gene_1   | 20.01     | 10.77     | 20.65       | 19.87       |
    # | gene_2    |  gene_2   | 21.68     | 23.13     | 37.43       | 49.37       |
    # | gene_3    |  gene_3   | 41.70     | 39.89     | 41.95       | 28.21       |
    # | gene_4    |  gene_4   | 24.46     | 19.94     | 30.98       | 30.68       |
    # | ...       |  ...      | ...       | ...       | ...         | ...         |
    # | gene_n    |  gene_n   | 11.96     | 12.23     | 32.27       | 12.31       |
    # |-----------|-----------|-----------|-----------|-------------|-------------|

    # ==> it will check the value in the first row:
    # |-----------|-----------|-----------|-----------|-------------|-------------|
    # | gene_1    |  gene_1   | 20.01     | 10.77     | 20.65       | 19.87       |
    # |-----------|-----------|-----------|-----------|-------------|-------------|

    # ==> then the "locus_tag" and "name" columns will be identified as non-numeric columns
    # ==> then the result we have: non_numeric_columns = ['locus_tag', 'name']
    non_numeric_columns = [col for col in convertedData.columns if not is_number_or_not(
        convertedData[col].iloc[0])]

    # If there are more than one non-numeric columns, just keep the first one, and remove the rest
    # ==> in the example above, the "locus_tag" and "name" columns are non-numeric columns, so only keep the "locus_tag" column, and remove the "name" column
    if len(non_numeric_columns) > 1:
        convertedData.drop(non_numeric_columns[1:], axis=1, inplace=True)

    # Set the first non-numeric column as the index of the DataFrame
    # ==> in the example above, the "locus_tag" column is now set as the index
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
    # So after transposing, samples (rows) are somethings like "H2O_30m_A", "H2O_30m_B", etc.; and features (columns) are somethings like "gene1", "gene2", etc.
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
    # PREPARE THE RESULT, FOLLOWED BY THE FORMAT OF REACT PLOTLY.JS
    #########################
    # Refer to the https://plotly.com/javascript/react/ for more detailed information
    # Briefly, the frontend <Plot> component of Plotly.js in React expects the "data" and "layout" properties as the following format:
    #  <Plot
    #        data={...}
    #        layout={...}
    #  />
    # So the "..." above are the things from the backend we generated here, which are "pcaScatterCoordinates" and "layoutPCAPlotForReact" below


    # The default colors of the points in the PCA plot
    defaultColor = "#272E3F"
    defaultBorderColor = "#000000"
    defaultTileFontColor = "#000000"

    # Prepare the "data" for the PCA plot
    pcaScatterCoordinates = [
        {
            # For more information about the "type", "mode", "marker", etc. refer to this link: https://plotly.com/javascript/reference/
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

    # Prepare the "layout" for the PCA plot
    layoutPCAPlotForReact = {
        # The title of the plot, which will be displayed above the plot
        # If we want to display the title, just uncomment the following code
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

    # Combine the "data" and the "layout" into a dictionary and return it as a JSON object
    # While reading here, read the file "frontend/app/page.js", at the function "generatePCAPlot()" to see how the data is received from the backend here
    # So in the frontend, at the file "frontend/app/page.js", at the function "generatePCAPlot()", it will receive a JSON object, which contains the "data" and the "layout", which we will then use to put in the <Plot> component of Plotly.js in React frontend
    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }
    #########################
    # End of PREPARE THE DATA, FOLLOWED BY THE FORMAT OF PLOTLY
    #########################

    # Return the result as a JSON object
    return jsonify(result)
