---
title: "Cross-Table Pretraining towards a Universal Function Space for Heterogeneous Tabular Data"
tags:
  - paper-reading
  - deep-learning
  - machine-learning
  - meta-learning
  - model-architecture
  - tabular-data
date: 2024-12-11
draft: false
summary: 'Summary of the paper "Cross-Table Pretraining towards a Universal Function Space for Heterogeneous Tabular Data"'
images:
  - /static/images/reading/xtformer/overview.png
---

## Summary

- The authors propose a new architecture called _CALinear_ that enables a _meta-function space_ which can be learned with a combination of multiple basis linear functions.

## Approach

- Instead of learning one linear layer after MHSA, learn a set of linear layers and some coefficient generator.
  - Claims that this method is more expressive and efficient.

![Overview](/static/images/reading/xtformer/overview.png)

> [!image/Architecture overview of XTFormer]

Vanilla attention:

$$
x' = \text{MHSA}(x) = \text{Softmax}(\text{Linear}(\frac{QK^T}{\sqrt{d_k}})V)
$$

The authors propose changing $\text{Linear}$ to $\text{CALinear}$, where:

$$
\begin{gather*}
\text{CALinear}(\cdot) = \sum_{i=1}^{n} c_i \cdot \text{Linear}(\cdot) \\
c_i = \text{Softmax}(\text{M}_{\text{cal}}(v_i))
\text{M}_{\text{cal}} = \text{Softmax}(\text{MLP}(x))
\end{gather*}
$$

where $v_i$ is a learnable _context_ vector for feature $i$ and $\text{M}_{\text{cal}}$ is the _calibration_ module.

In the proposed architecture, only $v_i$ and the embedding layer is trained from scratch for a new dataset. $\text{M}_{\text{cal}}$ is trained over multiple datasets during pre-training but is frozen during fine-tuning.

### Training for downstream task

2 stages

1. **Task Calibration**: learn task(dataset)-specific modules from scratch (embedding, output classifier, feature context $v_i$).
2. **Refinement**: fine-tune _all_ parameters on the downstream task.

## Findings

- XGB and CatBoost outperform most DL baselines.
- But CALinear beats them (pretty much) consistently.
- Using 4 - 6 basis functions significantly outperforms using 1-2 basis functions.
  - But 4 and 6 do not show a significant difference.
- Using $\text{M}_{\text{cal}}$ yields better performance than learning $c_i$ directly.
- More task calibration yields better performance for full-data settings. But for limited-data settings, it actually lowers performance.
  - Refinement seems to help in all cases.

## Resources

- [Paper](https://arxiv.org/abs/2406.00281)
