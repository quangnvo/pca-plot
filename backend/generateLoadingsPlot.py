import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

bp = Blueprint('generateLoadingsPlot', __name__)


@bp.route('/api/generate_loadings_plot', methods=['POST'])
def generate_scree_plot():

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

    print("🚀🚀🚀 DATA AFTER STANDARDIZATION \n")
    print(dataAfterStandardization)

    pcaObject = PCA(n_components=2)
    pcaObject.fit_transform(dataAfterStandardization)

    # Get the pca components (loadings)
    loadings = pcaObject.components_

    print("🚀🚀🚀 LOADINGS \n")
    print(loadings)
    print("🚀🚀🚀 LOADINGS SHAPE \n")
    print(loadings.shape)

    # Number of features before PCA
    n_features = pcaObject.n_features_in_
    print("n_features: \n", n_features)

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

    # Top 5 most contributing features for each PC
    # axis=0 means that the lambda function will apply to each column
    top_5_contributors = loadings_df.apply(
        lambda s: s.abs().nlargest(5).index.tolist(), axis=0)
    print("🚀🚀🚀 TOP 5 CONTRIBUTORS \n")
    print(top_5_contributors)

    # Top 5 least contributing features for each PC
    least_5_contributors = loadings_df.apply(
        lambda s: s.abs().nsmallest(5).index.tolist(), axis=0)
    print("🚀🚀🚀 LEAST 5 CONTRIBUTORS \n")
    print(least_5_contributors)

    #########################
    # Prepare the result following the Plotly format
    #########################

    # Four things done in the following code:
    # 1. Create labels for the scree plot, like "PC1", "PC2", etc.
    # 2. Prepare the data for the scree plot
    # 3. Prepare the layout for the scree plot
    # 4. Combine the data and the layout into a dictionary and return it as a JSON object

    # loadingsPlotFormatData = [
    #     {
    #         'type': 'bar',
    #         'x': labels,
    #         'y': percentageOfVariance.tolist(),
    #         # Display the percentage on top of each bar
    #         'text': [f'{value}%' for value in percentageOfVariance.tolist()],
    #         'textposition': 'auto',
    #         'marker': {
    #                 'color': 'yellow',
    #                 'line': {
    #                     'color': 'black',
    #                     'width': 2,
    #                 },
    #         }
    #     }
    # ]

    layoutLoadingslotForReact = {
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

    # result = {
    #     'data': screePlotFormatData,
    #     'layout': layoutScreePlotForReact
    # }

    return jsonify("")
