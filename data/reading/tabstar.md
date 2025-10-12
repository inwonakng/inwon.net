---
title: 'TabSTAR: A Foundation Tabular Model With Semantically Target-Aware Representations'
summary: ''
tags:
  - paper-summary
  - tabular-data
  - model-architecture
  - language-models
  - representation-learning
date: 2025-05-29
images:
  - /static/images/reading/tabstar/architecture.png
---

## Summary

The authors propose TabSTAR, a foundation model that brings together text and
table structure. Similar to [TP-BERTa](/reading/tp-berta), each cell is
transformed into a single token that encompasses both the cell value and the
column name. The authors introduce a **unified classification head** that
allows for cross-table training without learning task-specific heads.

## Approach

### Architecture

![TabSTAR Architecture](/static/images/reading/tabstar/architecture.png)

> [!image/TabSTAR Architecture]

**Verbalization**

- Serialize the cells into a some text, e.g. "column_name: cell_value".
- For numericals, apply binning (10 quantiles), and use the scale-aware text
  for the text part (e.g. `Age: 40–50 (Quantile 50–60%)`) - Also, learn
  magnitude-aware embeddings for each bin.

**Text Encoding**

- Use e5 model to get the embeddings of the tokens and apply attention.
  - The e5 model is also lightly fine-tuned (top $N$ layers).
- A single layer transformer block is then used to now "fuse" the embeddings
  into a single one. (similar to IFA module)

**Classification**

- The sequence, where each token is a cell, is then passed through a 6-layer transformer that maps the "interaction" between the cells.
  - All possible labels are added to the input sequence after all the row information. This allows each label to contain the "context" of the input.
- The label tokens of the resulting sequence are then used as input to a linear classifier head.
  - The single linear layer outputs the "score" for each label class.

### Experiments

**Training Data**

- Manually curated 350 tabular datasets (253 classification, 97 regression

**Evaluation Data**

- AutoML Multimodal Benchmark[^1]
- Benchmark from CARTE[^2]

**Baselines**

- TabPFNv2 (closed-source text version), CARTE

## Findings

- TabSTAR is strong on classification tasks
  - TabPFNv2 comes very close on < 10k samples, but in the larger datasets, the
    gap is larger.
- TabPFNv2 does better on regression compared to other NN-based methods. But
  GBDTs are still much better.
- Fine-tuning the encoder (e5) leads to better performance.
  - The results show that unfreezing the top 9 layers actually leads to worse
    performance than 6 or 3, but the authors think that this is due to lack of
    data.
- Pre-training is significantly better than training from scratch.
- Adding both the quantile name (string) and quantile vector (learnable param)
  is better than using only one of them.

## Resources

- [Paper](https://arxiv.org/abs/2505.18125)
- [Code]()

[^1]: [https://github.com/sxjscience/automl_multimodal_benchmark](https://github.com/sxjscience/automl_multimodal_benchmark)
[^2]: [arxiv](https://arxiv.org/abs/2402.16785)
