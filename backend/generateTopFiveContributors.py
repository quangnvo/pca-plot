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

import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateTopFiveContributors', __name__)


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


@bp.route('/api/generate_top_five_contributors', methods=['POST'])
def generate_top_five_contributors():

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

    # Store the name of the first column
    first_column_name = non_numeric_columns[0]

    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    pcaObject = PCA(n_components=4)
    pcaObject.fit_transform(dataAfterStandardization)
    #########################
    # End of CODE SIMILAR TO "generatePCA.py"
    #########################

    #########################
    # FIND THE TOP FIVE CONTRIBUTORS FOR EACH PRINCIPAL COMPONENT
    #########################
    # Use the "components_" attribute of the PCA object to get the loadings
    loadings = pcaObject.components_

    # Create the labels for the principal components, like "PC1", "PC2", etc.
    labelPrincipalComponents = [
        'PC' + str(i+1) for i in range(loadings.shape[0])]

    # Create a DataFrame from the loadings
    # The data frame will look like this:
    #       |  PC1  |  PC2  |  PC3  | ... | PCn  |
    # gene1 | 0.042 | 0.021 | -0.03 | ... | 0.12 |
    # gene2 | 0.563 | 0.241 | 0.123 | ... | 0.8  |
    # gene3 | 0.012 | 0.222 | 0.333 | ... | 0.011|
    # ...   | ...   | ...   | ...   | ... | ...  |
    # geneN | -0.23 | 0.512 | -0.215| ... | 0.033|
    loadings_df = pd.DataFrame(
        loadings.T,
        index=convertedData.index,
        columns=labelPrincipalComponents
    )

    top_five_contributors = []

    # The "labelPrincipalComponents" is ["PC1", "PC2", "PC3", ...]
    # So "for pc in labelPrincipalComponents" will iterate over each element in the "labelPrincipalComponents" list, which is "PC1", "PC2", "PC3", ...
    for pc in labelPrincipalComponents:
        # loadings_df[pc].map(abs): This make the value to be absolute to each element in the column "pc" of the "loadings_df"
        # sort_values(ascending=False): Then this sorts the absolute values in the column "pc" of the "loadings_df" in descending order
        # head(5): Then, this gets the first 5 elements in the sorted column pc of the DataFrame loadings_df
        # .index.to_series(): This gets the index of these top 5 rows and converts it into a pandas Series. The index is basically the gene name, like "gene47", "gene89", "gene136", "gene277", "gene342"
        # .map(loadings_df[pc]): This maps the index back to the original values in the "pc" column of "loadings_df". So, the result will like this:
        # |-----------|----------|
        # |  gene47   |  0.0782  |
        # |  gene89   |  0.0775  |
        # |  gene136  |  0.0773  |
        # |  gene277  |  0.0761  |
        # |  gene342  |  0.0758  |
        # |-----------|----------|

        contributors = loadings_df[pc].map(abs).sort_values(
            ascending=False).head(5).index.to_series().map(loadings_df[pc])

        # for gene, value in contributors.items(): This loop iterates over each item in the "contributors".
        # top_five_contributors.append({"Principal component": pc, "Gene": gene, "Loadings": value}): This line appends a dictionary to the "top_five_contributors" list.
        for gene, value in contributors.items():
            top_five_contributors.append({
                "Principal component": pc,
                first_column_name: gene,
                "Loadings": value
            })

    # The default colors of the points in the PCA plot
    defaultColor = "#272E3F"
    defaultBorderColor = "#000000"
    defaultTileFontColor = "#000000"

    pcaScatterCoordinates = [
        {
            'type': 'scatter',
            # The mode is 'markers+text' is IMPORTANT here, because it will show the name next to the point on the chart
            # If we use 'markers' only, the name will not be shown
            'mode': 'markers+text',
            'name': contributor[first_column_name],
            'x': [contributor["Principal component"]],
            'y': [contributor["Loadings"]],
            # "text" here is the name of the contributor (which means the name of the gene in the original data set)
            'text': [contributor[first_column_name]],
            # Position the text, we have "top", "bottom", "left", "top center", etc.
            'textposition': 'right',
            'marker': {
                'size': 24,
                'color': defaultColor,
                'line': {
                    'color': defaultBorderColor,
                    'width': 2,
                }
            },
        } for contributor in top_five_contributors
    ]

    # Prepare the layout for the PCA plot
    layoutPCAPlotForReact = {
        'xaxis': {
            'title': 'Principal Component',
            'titlefont': {
                'size': 20,
                'color': defaultTileFontColor,
            },
        },
        'yaxis': {
            'title': 'Loadings',
            'titlefont': {
                'size': 20,
                'color': defaultTileFontColor,
            },
        },
        'autosize': True,
        'hovermode': 'closest',
        'showlegend': True,
        'height': 400,
    }

    #########################
    # End of FIND THE TOP FIVE CONTRIBUTORS FOR EACH PRINCIPAL COMPONENT
    #########################

    # Convert the list to JSON
    # Read the frontend file "frontend/app/page.js" at the function "generateTopFiveContributors" to see the flow in frontend
    result_json = jsonify({
        # this one for the top 5 contributors TABLE
        "top_five_contributors": top_five_contributors,
        # this one for the top 5 contributors PLOT
        "loadingsPlotCoordinates": pcaScatterCoordinates,
        # this one for the top 5 contributors PLOT
        "layout": layoutPCAPlotForReact
    })

    # Return the JSON data
    return result_json
