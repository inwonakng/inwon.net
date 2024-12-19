---
title: "XTab: Cross-table Pretraining for Tabular Transformers"
tags:
  - paper
  - tabular-data
  - deep-learning
  - transfer-learning
date: 2024-06-24
draft: false
summary: 'Summary of the paper "XTab: Cross-table Pretraining for Tabular Transformers"'
images:
  - /static/images/reading/xtab/overview.png
---

## Summary

Use FT-Transformer architecture to learn dataset-specific embeddings and a **shared** backbone in a federated setting. Pre-training a transformer-based model shows superior performance over not. However, the proposed method is still beaten by CatBoost.

## Approach

![Framework overview](/static/images/reading/xtab/overview.png)

### Main Idea

- Train a _shared backbone_ (transformer stack) that can handle arbitrary embedding representation of tables.
- Learn a new set of embeddings for each table.

### Target Task

- Main: Classification
- Auxiliary: Reconstruction, Contrastive, Supervised (classification)

### Experiments

- 3 Types of backbones (FT-Transformer, FastFormer, Saint-V)
- Datasets from [OpenML-AutoML Benchmark](https://openml.github.io/automlbenchmark/)
  - 52 datasets for pre-training and 52 for fine-tuning/inference.
- Baselines:
  - Tree-based: Random Forest, XGBoost, LightGBM, CatBoost
  - NN: Autogluon
  - Transformer: FT-Transformer

### Input Transformation

- **categorical**: one-hot encoding and embedding lookup table.
- **continuous**: single embedding and scale by value.

## Findings

- Cross-table pre-training shows improved performance compared to single-table training.
  - Ablate with same FT-Transformer structure.
- _light fine-tuning_ (3 epochs) is actually better than _heavy fine-tuning_ (unlimited epochs until early stopping).
- GBDTs are still **quite** strong. But XTab seems best in the DL group.

## Resources

- [Paper](https://proceedings.mlr.press/v202/zhu23k/zhu23k.pdf)
- [Code](https://github.com/BingzhaoZhu/XTab)

