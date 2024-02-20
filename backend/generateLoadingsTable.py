import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateLoadingsTable', __name__)


@bp.route('/api/generate_loadings_table', methods=['POST'])
def generate_loadings_table():

    initialData = request.json
    convertedData = pd.DataFrame(data=initialData)

    nameOfTheFirstColumn = list(initialData[0].keys())[0]
    convertedData.set_index(nameOfTheFirstColumn, inplace=True)

    convertedData = convertedData.replace(',', '.', regex=True)
    convertedData = convertedData.astype(float)
    convertedData = convertedData.dropna()

    print("🚀🚀🚀 CONVERTED DATA \n")
    print(convertedData)

    standardScalerObject = StandardScaler()
    dataAfterStandardization = standardScalerObject.fit_transform(
        convertedData.T)

    pcaObject = PCA(n_components=2)
    pcaObject.fit_transform(dataAfterStandardization)

    # Get the pca components (loadings)
    loadings = pcaObject.components_

    print("In the generateLoadingsTable.py file aaaaaaaaa")

    print("🚀🚀🚀 LOADINGS \n")
    print(loadings)
    print("🚀🚀🚀 LOADINGS SHAPE \n")
    print(loadings.shape)

    # Create a DataFrame from the loadings
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
    print("\n 🚀🚀🚀 LOADINGS_DF")
    print(loadings_df)

  # Convert the DataFrame to a list of dictionaries
    loadings_list = loadings_df.reset_index().rename(
        columns={'index': 'Gene'}).to_dict('records')

    # Print the list
    print("\n 🚀🚀🚀 LOADINGS_LIST")
    print(loadings_list[0:5])

    # Convert the list to JSON
    result_json = jsonify(loadings_list)

    # Return the JSON data
    return result_json
