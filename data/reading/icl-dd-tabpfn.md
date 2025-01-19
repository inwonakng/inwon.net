---
title: "In-Context Data Distillation with TabPFN"
tags:
  - paper-reading
  - tabular-data
  - machine-learning
  - deep-learning
  - data-distillation
  - meta-learning
date: 2024-12-19
draft: false
summary: 'Summary of the paper "In-Context Data Distillation with TabPFN"'
images:
  - /static/images/reading/icl-dd-tabpfn/distill-compare.png
  - /static/images/reading/icl-dd-tabpfn/distill-evolution.png
---

## Summary

This paper explores applying data distillation for the _context data_ for TabPFN. The authors also draw a comparison of this process to *prompt-tuning* -- where the "prompt" is optimized for a particular task.

## Approach

![Comparison of traditional DD and ICD for TabPFN](/static/images/reading/icl-dd-tabpfn/distill-compare.png)

> [!image/Comparison of traditional data distillation and in-context distillation for TabPFN]
> Comparison of traditional data distillation (DD) and in-context data distillation (ICD) for TabPFN.

Minimize the following to _maximize the likelihood of $\mathcal{D}_{\text{train}}$ given $\mathcal{D}_{\text{distill}}$\_:

$$
\mathcal{L}(\mathcal{D}_{\text{train}} \rightarrow \mathcal{D}_{\text{distill}}) \triangleq - \mathbb{E}_{(x,y) \sim \mathcal{D}_{\text{train}}} \log p_{\theta}(y|x, \mathcal{D}_{\text{distill}})
$$

$\nabla_{\mathcal{D}}\mathcal{L}(\mathcal{D}_{\text{train}} \rightarrow \mathcal{D}_{\text{distill}})$, the gradient for $\mathcal{D}_{\text{distill}}$, can be _directly computed_ instead of proxy-training like previous data distillation works because TabPFN's inference step mimics the traditional training procedure, meaning that we don't have to _train_ the target model for each distillation iteration. In traditional data distillation, the target model is trained for $T$ iterations before $\mathcal{D}_{\text{distill}}$ is updated **once**.

## Findings

> [!setting]
> **TabPFN**: sample 1,000 random points from $\mathcal{D}_{\text{train}}$ to use as $\mathcal{D}_{\text{context}}$.
> **TabPFN-ICD**: Distill $\mathcal{D}_{\text{distill}}$ with 1,000 samples from $\mathcal{D}_{\text{train}}$ and use as $\mathcal{D}_{\text{train}}$.
> **Datasets**: From Tabzilla, but only use ones with more than 2,000 samples.

![Evolution of distilled data points](/static/images/reading/icl-dd-tabpfn/distill-evolution.png)

> [!image/Evolution of distilled data points]
> Evolution of the distilled points.
>
> - dots with white outline: distilled points.
> - dots with black outline: test points.
> - shade (red/blue): predicted label.
> - black line: decision boundary where $p(y|x, \mathcal{D}_{\text{distill}}) = 0.5$.

- TabPFN's performance (comparative to XGB) drops as a function of the number of samples.
- Applying data distillation to get the context data actually improves performance.

## Resources

- [Paper](https://arxiv.org/abs/2402.06971v1)

