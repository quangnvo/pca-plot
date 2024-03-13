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
    # This "is_number_or_not" function checks if a string is a number
    # The name "is_number_or_not" is not really a nice name for this function, but "is_number" is a function already built-in in Python, and the "is_number" only check the number with dot ".", so the comma "," will not be recognized as a number.
    # That's why we use "is_number_or_not", in which we use s.replace(',', '') to handle the data that may contain comma as the decimal delimiter
    # This function is used to identify the columns that contain non-numeric values
    try:
        float(s.replace(',', ''))
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

    pcaObject = PCA(n_components=2)
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

  # Get the top 5 contributors for each principal component
    top_five_contributors = []

    # The "labelPrincipalComponents" is ["PC1", "PC2", "PC3", ...]
    for pc in labelPrincipalComponents:
        # loadings_df[pc].map(abs): This applies the absolute value function to each element in the column pc of the DataFrame loadings_df
        # sort_values(ascending=False): This sorts the values in the column pc of the DataFrame loadings_df in descending order
        # head(5): This gets the first 5 elements in the sorted column pc of the DataFrame loadings_df
        # .index.to_series(): This gets the index of these top 5 rows and converts it into a pandas Series.
        # .map(loadings_df[pc]): This maps the indices back to the original values in the pc column of loadings_df. The result is a Series of the top 5 contributors to the principal component pc, indexed by their gene names.
        contributors = loadings_df[pc].map(abs).sort_values(
            ascending=False).head(5).index.to_series().map(loadings_df[pc])

        # for gene, value in contributors.items(): This loop iterates over each item in the contributors Series. Each item is a tuple where the first element is the gene name (index) and the second element is the corresponding value.
        # top_five_contributors.append({"Principal component": pc, "Gene": gene, "Loadings": value}): This line appends a dictionary to the top_five_contributors list. The dictionary contains three key-value pairs: the principal component label, the gene name, and the corresponding value.
        for gene, value in contributors.items():
            top_five_contributors.append({
                "Principal component": pc,
                first_column_name: gene,
                "Loadings": value
            })
    #########################
    # End of FIND THE TOP FIVE CONTRIBUTORS FOR EACH PRINCIPAL COMPONENT
    #########################

    # Convert the list to JSON
    result_json = jsonify(top_five_contributors)

    # Return the JSON data
    return result_json
