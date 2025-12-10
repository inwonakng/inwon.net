---
title: "TuneTables: Context Optimization for Scalable Prior-Data Fitted Networks"
summary: "Summary of the TuneTables paper"
tags:
  - paper-summary
  - tabular-data
  - transformers
  - in-context-learning
  - prompt-learning
date: 2025-02-24
images:
  - /static/images/reading/tunetables/overview.png
  - /static/images/reading/tunetables/compare-scaling.png
---

## Summary

The authors propose a prompt-tuning based method to improve the performance of TabPFN.

## Approach

![Overview of approach](/static/images/reading/tunetables/overview.png)

> [!image] Overview of proposed approach
> The proposed approach adds a learnable soft-prompt on top of the TabPFN model. The authors find that the original data may not even be necessary in some cases, and using the soft-prompts alone will give good performance.

### Drawbacks of TabPFN

1. Fixed number of features -- if the input dataset has more than the fixed size of features, the pre-trained TabPFN cannot handle it.
2. Poor scaling with dataset size (v2 improves it but doesn't seem good enough yet)
3. Fixed number of classes -- similar issue to point 1., the MLP head head is pre-trained with fixed dimensions.

![Scalability comparison](/static/images/reading/tunetables/compare-scaling.png)

> [!image] Comparison of scaling between TabPFN, CatBoost and TuneTables
> The box in the lower left corner represents the *comfort zone* for TabPFN (\<3000 data points and \<100 features). The first plot shows that CatBoost dominates in the high-scale regime, while the secon dplot shows that TuneTables is more comparable. The third plot shows that TuneTables also outperforms TabPFN in this regime.

### Remedies for Scalability

The authors then explore some possible remedies to allow TabPFN to scale better with larger (both row/column wise) datasets.

**Sketching**: Random sampling, Coreset selection, $k$-means.

**Feature Selection**: Random sampling, Mutual information, PCA

**Fine-tuning**: Continue the fine-tuning processs of TabPFN on the large dataset.

### Prompt Tuning (Parameter Efficient Fine-Tuning)

PFN takes two *types* of embeddings -- row and label. So two types of propmts: $D_{\text{tune }X} \in \R^{p \times e}$ and $D_{\text{tune }y} \in \R^{p \times 1}$ are tuned.

### Datasets

Curate from WhyTrees[^1] to find *very large* datasets. (up to 1,900,000 rows and 7,200 features)

### Bias Mitigation

The authors also explore if TuneTables can be used to *mitigate bias* with respect to sensitive attributes.

Given a **protected group** $G_1$ and **unprotected group** $G_0$ and a **sensitive attribute** $x_{\cdot, a}$, the authors define the bias metric (demographic parity) as:
$$
P_{(x_i,y_i) \in G_0}(y_i = 1 | x_{i,a}) - P_{(x_i,y_i) \in G_1}(y_i = 1 | x_{i,a})
$$
which measures the difference in probability of a positive label given the sensitive attribute in the protected and unprotected groups.

The authors opt to handle this in the prompt-tuning stage by adding a regularization term that aims to minimize this difference:
$$
\left | \sum_{(x_i,y_i) \in G_0} P(y_i = 1 | x_{i,a}) - \sum_{(x_i,y_i) \in G_1} P(y_i = 1 | x_{i,a}) \right |
$$

## Findings

- Sketching and feature selection methods reach a plateau before becoming competetive with GBDT models.
- Fine-tuning (full params) is too expensive.
- TuneTables is faster at inference time (around 9x of TabPFN). But it also requires a lot more trainig time.
  - The authors consider a medium and light version of the TuneTables approach to analyze trade-off between train resource and performance (less HPO, faster early stopping, etc.)
  - The lighter versions are (on average) better than TabPFN still, while losing some performace to the full variant.
- The prompt-tuning approach can also add additional objectives to the model, such as bias mitigation.

## Resources

- [Paper](https://www.arxiv.org/pdf/2402.11137)
- [Code](https://github.com/penfever/TuneTables)

[^1]: Grinsztajn, Léo, Edouard Oyallon, and Gaël Varoquaux. "Why do tree-based models still outperform deep learning on typical tabular data?." Advances in neural information processing systems 35 (2022): 507-520.
