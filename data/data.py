import pandas as pd
import xenaPython as xena

def get_field(dataset, samples, probe):
    """
    Returns all values for a specific field for a list of samples

    Parameters:
        dataset: name of Xena dataset to query (string)
        samples: list of sample ID"s (list)
        probe: name of field to get values for (string)
    
    Returns:
        field_values: list of values for specified samples (list)
    """

    # get dictionary to map result code to actual results
    field_codes = xena.field_codes(host, dataset, [probe])[0]["code"]
    codes_dict = dict(enumerate(field_codes.split("\t")))
    
    # get field value codes and map to results
    raw_values = xena.dataset_fetch(host, dataset, samples, [probe])[0]
    field_values = list(map(codes_dict.get, raw_values))

    return field_values

def get_expression(gene, samples):
    # get expression results
    dataset = "TcgaTargetGtex_RSEM_Hugo_norm_count"
    samples = xena.dataset_samples(host, dataset, None)
    expression = xena.dataset_gene_probes_values(host, dataset, samples, gene)[1][0]
    
    return expression

def get_data(genes, diseases):
    """
    Gets expression results and relevant metadata for all samples for a specific gene

    Parameters:
        gene: name of gene to query (string)
    
    Returns: 
        data: dataframe that contains all samples, expression results, and metadata (pd.DataFrame)
    """

    # get expression results
    dataset = "TcgaTargetGtex_RSEM_Hugo_norm_count"
    samples = xena.dataset_samples(host, dataset, None)
    expression = xena.dataset_gene_probes_values(host, dataset, samples, gene)[1][0]
    
    # get relevant metadata (sample type and disease/tissue)
    dataset = "TcgaTargetGTEX_phenotype.txt"
    disease_tissue = get_field(dataset, samples, "primary disease or tissue")

    # create DataFrame, clean data results, and store data
    data = pd.DataFrame()
    data["Sample"] = samples
    data["Study"] = data["Sample"].apply(lambda x: x.split("-")[0])
    data["Expression"] = expression
    data["Disease/Tissue"] = disease_tissue
    data["Disease/Tissue"] = data["Disease/Tissue"].apply(lambda x : x.split(" - ")[0] if x is not None else x )

    # filter data 
    graph_data = data[(data["Disease/Tissue"].isin(list(diseases)))]
    
    # normal_data = data[(data["Study"] == "GTEX") & (data["Sample Type"].isin(sample_types)) & data["Disease/Tissue"].isin(tissues)]
    # cancer_data = data[(data["Disease/Tissue"].isin(list(diseases))) & data["Sample Type"].isin(sample_types)]
    # graph_data = pd.concat([cancer_data, normal_data], axis=0)
    
    return graph_data

cohort = "TCGA TARGET GTEx"
host = xena.PUBLIC_HUBS["toilHub"]

# get list of all samples in database
dataset = "TcgaTargetGtex_RSEM_Hugo_norm_count"
samples = xena.dataset_samples(host, dataset, None)

# get relevant metadata (disease / tissue)
dataset = "TcgaTargetGTEX_phenotype.txt"
disease_tissue = get_field(dataset, samples, "primary disease or tissue")

# create dataframe and add samples + metadata
data = pd.DataFrame()
data["Sample"] = samples
data["Study"] = data["Sample"].apply(lambda x: x.split("-")[0])
data["Disease/Tissue"] = disease_tissue
data["Disease/Tissue"] = data["Disease/Tissue"].apply(lambda x : x.split(" - ")[0] if x is not None else x )

# add gene expression information for each of the 10 genes
genes = ['TNF', 'MS4A1','EGFR', 'VEGFA', 'ERBB2', 'CTLA4', 'PDCD1', 'IL6','TNFSF11', 'PCSK9']
for gene in genes:
    dataset = "TcgaTargetGtex_RSEM_Hugo_norm_count"
    expression = xena.dataset_gene_probes_values(host, dataset, samples, gene)[1][0]
    data[gene] = expression

# convert dataframe to csv
data.to_csv('data.csv', index=False)



