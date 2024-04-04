# --------------------------------
#
# 🚀 Created by Quang, 2024
# ✉️ For any inquiries, suggestions, or discussions related to this work, feel free to contact me at: voquang.usth@gmail.com
#
# --------------------------------

#########################
#
# ⭐⭐⭐
# NOTICE
# Check the file "generatePCA.py" for the detail explanation, as a half of the code here is similar to the code in "generatePCA.py"
# ⭐⭐⭐
#
#########################

import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateLoadingsTable', __name__)


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


@bp.route('/api/generate_loadings_table', methods=['POST'])
def generate_loadings_table():

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

    # The "n_components" parameter is used to specify the number of principal components to be created
    # If not specified, then default value of "n_components" is min(n_samples, n_features)
    # For example, if the number of samples is 24 and the number of genes is 1000, then the default value of "n_components" will be 24
    # If the number of samples is 24 and the number of genes is 10, then the default value of "n_components" will be 10
    pcaObject = PCA(n_components=4)
    pcaObject.fit_transform(dataAfterStandardization)

    #########################
    # End of CODE SIMILAR TO "generatePCA.py"
    #########################

    #########################
    # GET THE LOADINGS AND CREATE THE JSON DATA
    #########################
    # The loadings are the coefficients of the linear combination of the original variables that make up the principal components
    # Use the "components_" attribute of the PCA object to get the loadings
    loadings = pcaObject.components_

    # Then create the "labels" for the principal components, like "PC1", "PC2", "PC3", etc.
    labelPrincipalComponents = [
        'PC' + str(i+1) for i in range(loadings.shape[0])]

    # Then create a DataFrame from the "loadings"
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

    # Then convert the DataFrame to a list of dictionaries
    # The purpose of this is to make it easier to convert the data to a JSON object
    # reset_index(): This function resets the index of the DataFrame and makes it a column in the DataFrame.
    # rename(columns={'index': first_column_name}): This function renames the column labeled ‘index’ to first_column_name.
    # to_dict('records'): This function converts the DataFrame into a list of dictionaries. The ‘records’ argument means that each item in the list will be a dictionary representing a row in the DataFrame, where the "keys" are the "column names" and the "values" are the "data in the row".
    #
    # For example, if loadings_df above looks like this:
    #       |  PC1  |  PC2  |
    # gene1 |  a0   |   b0  |
    # gene2 |  a1   |   b1  |
    #
    # Then, after running the following code, it will become like this:
    # loadings_list = [
    #   {
    #       'locus_tag': "gene1",
    #       'PC1': 'a0',
    #       'PC2': 'b0'
    #   },
    #   {
    #       'locus_tag': "gene2",
    #       'PC1': 'a1',
    #       'PC2': 'b1'
    #   }
    # ]
    loadings_list = loadings_df.reset_index().rename(
        columns={'index': first_column_name}).to_dict('records')

    # Then convert the list of dictionaries to a JSON object
    # Read the frontend file "frontend/app/page.js", at the function "generateLoadingsTable" and "renderLoadingsTable" to see the flow in frontend
    result_json = jsonify(loadings_list)
    #########################
    # End of GET THE LOADINGS AND CREATE THE JSON DATA
    #########################

    return result_json
