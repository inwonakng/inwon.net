---
title: 'Making Pre-trained Language Models Great on Tabular Prediction'
date: '2024-11-28'
tags:
  - paper-reading
  - deep-learning
  - machine-learning
  - pretrained-model
  - tabular-data
  - language-model
  - transfer-learning
draft: false
summary: Summary of the paper "Making Pre-trained Language Models Great on Tabular Prediction"
images:
  - /static/images/reading/tp-berta/overview.png
---

## Summary

The paper presents a fine-tuned RoBERTa-based model for tabular data classification. The authors use what they call **Relative Magnitude Tokens** (decision tree binning + scaling by magnitude) in combination with the **Intra-Feature Attention**.

The authors propose:

- Magnitude-aware regularization to share bin embeddings across features/datasets.
- Intra-Feature Attention (IFA) to mix different tokens of a feature before merging.

## Approach

![Overview of approach](/static/images/reading/tp-berta/overview.png)

> [!image/Overview of approach]

**Relative Magnitude Tokens**:

- Decision tree binning + multiply by magnitude.
- Magnitude-aware regularization to **share** the bin embeddings across feature/datasets with a _triplet loss_.
  - _Triplet Loss_: Similar to contrastive loss, but use a triplet formulation, where there is an _anchor_, _positive_ and _negative_ samples.

$$
\begin{gather}
L_{reg} = \max(\text{dist}(f(k_1), f(k_2)) - \text{dist}(f(k_1), f(k_3)) + \text{mag}(k_1,k_2,k_3),0),\\
s.t.~|k_1 - k_2 | < |k_1 - k_3| \\
f(k) = \text{LayerNorm}(\text{Linear}(\text{Embed}(k, E))) \\
\text{mag}(k_1, k_2, k_3) = \frac{|k_1-k_3| - |k_1-k_2|}{n_{\text{bin}}}
\end{gather}
$$

**Intra-Feature Attention**:

- _Mix_ the different tokens of a feature (name, value) into a CLS token before the features are merged. One MHSA module is shared across features for this.

## Findings

- Starting from the pre-trained RoBERTa weights is good.
- IFA is good.
- GBDTs are still better when most features are numerical.
- But TP-BERT shines on categorical.
  > [!question]
  > Why could this be? TabPFN shows better performance on numerical-dominated features.
- XGB requires more optimization -- Catboost offers better out-of-the-box performance.

## Resources

- [Code](https://github.com/jyansir/tp-berta)
