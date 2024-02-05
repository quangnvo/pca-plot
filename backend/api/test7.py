import json

import pandas as pd
import plotly
import plotly.express as px
import plotly.graph_objects as go
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from sklearn import datasets
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/pca_plot', methods=['GET'])
def pca_plot():
    # Load the data from a CSV file
    df = pd.read_csv(
        r"F:/myStudy/Course_Workshop_Internship/016_HIDA/000__CODE/pca-plot/database/salmonella-small-proteins_24h-dual-rna-seq.csv", sep="\t")

    # Replace commas with dots in the numeric columns and convert them to float
    for col in ['logFC', 'logCPM', 'PValue', 'FDR']:
        df[col] = df[col].str.replace(',', '.').astype(float)

    # Standardize the features to have mean=0 and variance=1
    # replace with your features
    features = ['logFC', 'logCPM', 'PValue', 'FDR']
    x = df.loc[:, features].values
    x = StandardScaler().fit_transform(x)

    # Compute the PCA
    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    principalDf = pd.DataFrame(
        data=principalComponents, columns=['PC1', 'PC2'])

    # Concatenate the target_names to the principal components
    # replace 'target_names' with your target
    finalDf = pd.concat([principalDf, df[['locus tag']]], axis=1)

    # Create the plot
    fig = px.scatter(finalDf, x='PC1', y='PC2', color='locus tag')

    # Convert the plot to JSON
    plot_json = plotly.io.to_json(fig, pretty=True)

    return plot_json


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
