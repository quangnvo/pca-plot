import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateTopFiveContributors', __name__)


@bp.route('/api/generate_top_five_contributors', methods=['POST'])
def generate_top_five_contributors():

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

    pcaObject = PCA(n_components=2)
    pcaObject.fit_transform(dataAfterStandardization)

    # Get the pca components (loadings)
    loadings = pcaObject.components_

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

  # Get the top 5 contributors for each principal component
    top_five_contributors = []

    for pc in labelPrincipalComponents:
        contributors = loadings_df[pc].map(abs).sort_values(
            ascending=False).head(5).index.to_series().map(loadings_df[pc])
        for gene, value in contributors.items():
            top_five_contributors.append({
                "Principal component": pc,
                "Gene": gene,
                "Loadings": value
            })

    print("🚀🚀🚀 TOP FIVE CONTRIBUTORS co negative va positive \n")
    print(top_five_contributors)

    # Convert the list to JSON
    result_json = jsonify(top_five_contributors)

    # Return the JSON data
    return result_json
