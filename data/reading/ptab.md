---
title: "PTab: Using the Pre-trained Language Model for Modeling Tabular Data"
summary: ""
tags:
  - paper-summary
  - fine-tuning
  - language-model
  - representation-learning
  - table-to-text
  - tabular-data
date: 2025-01-13
draft: false
images:
  - /static/images/reading/ptab/overview.png
---

## Summary

This paper proposes PTab, a method to fine-tune a pre-trained language model into a tabular classifier. The authors leverage masked language model paradigm to learn representation of tabular data.

## Approach

![Overview of approach](/static/images/reading/ptab/overview.png)

> [!image] Overview of PTab

### 1. Modality transformation

- Convert the tabular data into text.
  - e.g.`age:18 sex:male job:student ...`

### 2. Masked fine-tuning

- Turn the textualized tabular data into a sequence of tokens.
- Fine-tune the model to predict masked token, like how BERT works.

> [!important]
> The whole model is being fine-tuned, not just the token embeddings!

### 3. Task fine-tuning

- Take the best model from masked fine-tunine.
- Use embedding of `[CLS]` as input to a classifier.

### Experiments

- 8 binary classification datasets.

## Findings

- Outperforms both (non-GBDT) SotA and GBDT.
- Ablating the masked fine-tuning shows that the model indeed picks up on semantically useful features when MFT is applied.

## Resources

- [Paper](https://arxiv.org/abs/2209.08060)

