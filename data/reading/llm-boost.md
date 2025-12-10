---
title: 'Transformers Boost the Performance of Decision Trees on Tabular Data across Sample Sizes'
summary: 'Summary of the LLM/PFN-Boost paper'
tags:
  - paper-summary
  - boosting
  - deep-learning
  - decision-tree
  - machine-learning
  - model-reprogramming
  - tabular-data
  - transformers
date: 2025-02-06
draft: false
images:
  - /static/images/reading/llm-boost/architecture.png
---

## Summary

This paper proposes LLM-Boost and PFN-Boost, methods that leverage either a pre-trained LLM or a TabPFN model and train additional boosted trees on top of them. The authors show that these methods outperform the current state-of-the-art methods across various sample sizes and datasets.

## Approach

![Overview of proposed approach](/static/images/reading/llm-boost/architecture.png)

> [!image] Overview of proposed approach
> As seen in this diagram, the LLM is prompted to perform a classification task on the input dataset. The logits of the LLM's label (next token) prediction is then used as the first tree's classification. The following trees learn on the previous trees' residual.

The authors leverage a transformer model (either LLM or PFN) as the first classifier in the ensemble. the rest of the ensemble, which are decision trees, are then trained on the residuals of the previous model (including the transformer).
When using the LLM, the mean of the next-token prediction logits is used as the classification output (it's averaged because there can be cases where the label is more than a single token.)

The original XGBoost trains the ensemble by inputting a constant value for each label to build upon. The authors exchange this constant value with the transformer's classification logits to start the ensemble.

### Experiments

#### Models

- **Boosting**: XGBoost, LightGBM
- **LLM**: Qwen-2.5-72B-Instruct, Flan-T5-XXL, Llama-3-8B-Instruct
- **PFN**: TabPFN.

In addition to the boosting parameters, the authors introduce an additional weighting parameter $s$ to control the influence of the transformer's output on the rest of the ensemble, which is also optimized in the HPO stage.

$$
\text{pred}_{(0,i)} = \text{pred}_{(1,i)} + \underline{s} \cdot \text{SCORE}_{\text{Transformer}} + C
$$

where $\text{pred}_{(a,b)}$ denotes the prediction of classifiers $a$ to $b$, $\text{SCORE}_{\text{Transformer}}$ is the transformer's output, and $C$ is a constant.

The authors consider two types of baselines to compare against:

**Selection**: best performer among XGBoost, LightGBM, and TabPFN and LLMs.
**Stacking**: Use LLM features as part of input to GBDT

#### Datasets

- 16 datasets from UCI and TabLLM[^1].
- Less than 5 classes. (they all seem to be classification)
- Tested on 10, 25, 50, 100, 200, 500 and full dataset.

## Findings

- Lighter compute usage.
  - Just the forward passes of the transformer backbone needs to be computed, and the rest is the same as regular GBDT.
- PFN-Boost and LLM-Boost outperform their respective baselines in aggregate.
- PFN-Boost outperforms LLM-Boost in most cases, but LLM-Boost is not bad in low-data regimes.
  - Should be noted though that the LLM here is the 72B Qwen, so much larger than the PFN backbone.
- Smaller LLM is not bad, but it's hard to get it to behave correctly (only respond with class label, esp. for Llama-3-8B-Instruct).
- LLMs care about column headers -- but as the dataset size increases, the gap is closed(?!).

## Resources

- [Paper](http://arxiv.org/abs/2502.02672)

[^1]: Hegselmann, Stefan, Alejandro Buendia, Hunter Lang, Monica Agrawal, Xiaoyi Jiang, and David Sontag. "Tabllm: Few-shot classification of tabular data with large language models." In International Conference on Artificial Intelligence and Statistics, pp. 5549-5581. PMLR, 2023.
