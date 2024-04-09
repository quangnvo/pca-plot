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

    # Now we convert the data into a DataFrame
    # So let assume that after converting the "initialData" into a Dataframe, the "convertedData" is like this:
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
    convertedData = pd.DataFrame(data=initialData)

    # Identify columns in the first row that contain non-numeric values
    # For example, with the data above we have:
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

    # ==> so it will take the first row and check:
    # |-----------|-----------|-----------|-----------|-------------|-------------|
    # | gene_1    |  gene_1   | 20.01     | 10.77     | 20.65       | 19.87       |
    # |-----------|-----------|-----------|-----------|-------------|-------------|

    # ==> then the "locus_tag" and "name" columns will be identified as non-numeric columns
    # ==> then the result we have is:
    # non_numeric_columns = ['locus_tag', 'name']
    non_numeric_columns = [col for col in convertedData.columns if not is_number_or_not(
        convertedData[col].iloc[0])]

    # At here, if there are more than one non-numeric columns, just keep the first one, and remove the rest
    # ==> in the example above, the "locus_tag" and "name" columns are non-numeric columns, so we only keep the "locus_tag" column, and remove the "name" column
    # The "axis=1" means that we need column to be dropped, not row. Because row is axis=0, and column is axis=1
    # The "inplace=True" means that the DataFrame will be modified directly, without creating a new DataFrame
    # So now the "convertedData" DataFrame will be like this:
    # |-----------|-----------|-----------|-------------|-------------|
    # | locus_tag | H2O_30m_A | H2O_30m_B | PNA79_30m_A | PNA79_30m_B |
    # |-----------|-----------|-----------|-------------|-------------|
    # | gene_1    | 20.01     | 10.77     | 20.65       | 19.87       |
    # | gene_2    | 21.68     | 23.13     | 37.43       | 49.37       |
    # | gene_3    | 41.70     | 39.89     | 41.95       | 28.21       |
    # | gene_4    | 24.46     | 19.94     | 30.98       | 30.68       |
    # | ...       | ...       | ...       | ...         | ...         |
    # | gene_n    | 11.96     | 12.23     | 32.27       | 12.31       |
    # |-----------|-----------|-----------|-------------|-------------|
    if len(non_numeric_columns) > 1:
        convertedData.drop(non_numeric_columns[1:], axis=1, inplace=True)

    # Now we set the first non-numeric column as the index of the DataFrame
    # ==> in the example above, the "locus_tag" column is now set as the index
    # So now the "convertedData" DataFrame will be like this:
    #              |-----------|-----------|-------------|-------------|
    #  locus_tag   | H2O_30m_A | H2O_30m_B | PNA79_30m_A | PNA79_30m_B |
    #              |-----------|-----------|-------------|-------------|
    #  gene_1      | 20.01     | 10.77     | 20.65       | 19.87       |
    #  gene_2      | 21.68     | 23.13     | 37.43       | 49.37       |
    #  gene_3      | 41.70     | 39.89     | 41.95       | 28.21       |
    #  gene_4      | 24.46     | 19.94     | 30.98       | 30.68       |
    #  ...         | ...       | ...       | ...         | ...         |
    #  gene_n      | 11.96     | 12.23     | 32.27       | 12.31       |
    #              |-----------|-----------|-------------|-------------|
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
    # Create a scaling object by using StandardScaler() of scikit-learn
    standardScalerObject = StandardScaler()
    # If we put the data into the scaling object, the data will be standardized
    # At here, the data is transposed because the StandardScaler object expects the data to be in the form of [n_samples, n_features].
    # ==> so after transposing, samples (rows) are somethings like "H2O_30m_A", "H2O_30m_B", etc.; and features (columns) are somethings like "gene1", "gene2", etc.
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)
    #########################
    # End of STANDARDIZE THE DATA
    #########################

    #########################
    # DO THE PCA
    #########################
    # Create a PCA object by using PCA() of scikit-learn
    # The "n_components" parameter is used to specify the number of principal components to be created
    # If not specified, then default value of "n_components" is min(n_samples, n_features)
    # For example, if the number of samples is 24 and the number of genes is 1000, then the default value of "n_components" will be 24
    # If the number of samples is 24 and the number of genes is 10, then the default value of "n_components" will be 10
    pcaObject = PCA(n_components=2)

    # Then pass the standardized data above into the PCA object
    # A notice is that the "dataAfterStandardization" was already transposed above, so now the "pcaData" will be like this:
    # |-----------|-----------|
    # | PC1       | PC2       |
    # |-----------|-----------|
    # | -24.46    | -6.99     |   --> this is for H2O_30m_A
    # | -26.56    | -2.47     |   --> this is for H2O_30m_B
    # | 15.28     | -5.62     |   --> this is for PNA79_30m_A
    # | 16.87     | -6.93     |   --> this is for PNA79_30m_B
    # |-----------|-----------|
    # So when we draw the PCA plot, we will use the "PC1" as the x-axis and the "PC2" as the y-axis with the corresponding values above as the coordinates of the points
    # ==> for example, the point for "H2O_30m_A" will be at coordinate x = -24.46, y = -6.99 in the plot
    #
    #
    # NOTICE: if above, the "n_components" is set to another number, then the "pcaData" will have that number of columns, not only 2 columns
    # ==> for example, if "n_components=5", then the "pcaData" will have 5 columns, including PC1, PC2, PC3, PC4, and PC5
    # ==> so the "pcaData" will be like this:
    # |-----------|-----------|-----------|-----------|-----------|
    # | PC1       | PC2       | PC3       | PC4       | PC5       |
    # |-----------|-----------|-----------|-----------|-----------|
    # | -24.46    | -6.99     | 11.24     | 12.45     | 12.56     |   --> this is for H2O_30m_A
    # | -26.56    | -2.47     | 9.44      | 10.55     | 9.16      |   --> this is for H2O_30m_B
    # | 15.28     | -5.62     | 12.14     | 7.56      | 9.67      |   --> this is for PNA79_30m_A
    # | 16.87     | -6.93     | 13.57     | 9.67      | 12.78     |   --> this is for PNA79_30m_B
    # |-----------|-----------|-----------|-----------|-----------|
    pcaData = pcaObject.fit_transform(dataAfterStandardization)

    # Now we get the variance percentage of each principal component by using the "explained_variance_ratio_" attribute of the PCA object
    # ==> so the "pcaVariancePercentage" will be an array, in which the first element is the variance percentage of the first principal component, the second element is the variance percentage of the second principal component, and so on
    # ==> for example, if the "pcaVariancePercentage" is [0.7419, 0.2581], it means that the first principal component explains 74.19% of the variance, and the second principal component explains 25.81% of the variance
    pcaVariancePercentage = pcaObject.explained_variance_ratio_
    #########################
    # End of DO THE PCA
    #########################

    #########################
    # PREPARE THE RESULT
    #########################
    # The PCA plot will be drawn in the frontend using Plotly.js
    # Briefly, the frontend <Plot/> component of Plotly.js in React frontend is used to draw the PCA plot
    # The <Plot/> component requires the "data" and "layout" properties to draw the plot
    # The <Plot/> component has the following format:
    #  <Plot
    #        data={...}
    #        layout={...}
    #  />
    # ==> in which the "{...}" above are the things from the backend we generated here, which are "pcaScatterCoordinates" and "layoutPCAPlotForReact" below
    # So after we make the "pcaScatterCoordinates" and "layoutPCAPlotForReact" as below, we will return them as a JSON object to frontend, and in frontend, we put them into the <Plot/> component ==> so the PCA plot will be drawn

    #########################
    # PREPARE THE RESULT --- Default colors
    #########################
    # The default colors of the points in the PCA plot
    defaultColor = "#272E3F"
    defaultBorderColor = "#000000"
    defaultTileFontColor = "#000000"
    #########################
    # End of PREPARE THE RESULT --- Default colors
    #########################

    #########################
    # PREPARE THE RESULT --- Prepare the "data" for the <Plot/> component in frontend
    #########################
    pcaScatterCoordinates = [
        {
            # For more information about the "type", "mode", "marker", etc. refer to this link: https://plotly.com/javascript/reference/
            'type': 'scatter',
            'mode': 'markers',
            'name': convertedData.columns[i],
            # "x" is the (row i, first column) of the "pcaData" array, which is the PC1
            'x': [pcaData[i, 0]],
            # "y" is the (row i, second column) of the "pcaData" array, which is the PC2
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
    #########################
    # End of PREPARE THE RESULT --- Prepare the "data" for the <Plot/> component in frontend
    #########################

    #########################
    # PREPARE THE RESULT --- Prepare the "layout" for the <Plot/> component in frontend
    #########################
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
            # The "pcaVariancePercentage[0]*100:.2f" is to format the percentage to 2 decimal places
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
    #########################
    # End of PREPARE THE RESULT --- Prepare the "layout" for the <Plot/> component in frontend
    #########################

    #########################
    # PREPARE THE RESULT --- Combine "data" and "layout"
    #########################
    # Combine the "data" and the "layout" into a dictionary and return it as a JSON object
    # While reading here, read the file "frontend/app/page.js", at the function "generatePCAPlot()" to see how the data is received from the backend here
    # So in the frontend, at the file "frontend/app/page.js", at the function "generatePCAPlot()", it will receive a JSON object, which contains the "data" and the "layout", which we will then use to put in the <Plot> component of Plotly.js in React frontend
    result = {
        'data': pcaScatterCoordinates,
        'layout': layoutPCAPlotForReact
    }
    #########################
    # End of PREPARE THE RESULT --- Combine "data" and "layout"
    #########################

    #########################
    # End of PREPARE THE RESULT
    #########################

    # Return the result as a JSON object
    return jsonify(result)
