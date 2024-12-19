---
title: 'TabR: Tabular Deep Learning Meets Nearest Neighbors'
date: '2024-12-12'
tags:
  - tabular-data
  - deep-learning
  - meta-learning
draft: false
summary: Summary of the TabR paper
images:
  - /static/images/reading/tabr/mechanism.png
  - /static/images/reading/tabr/similarity.png
  - /static/images/reading/tabr/comparison.png
  - /static/images/reading/tabr/comparison2.png
---

## Summary

The paper presents a retrieval-augmented generation (RAG) inspired model for tabular data classification. The authors propose a new mechanism for similarity calculation and retrieval and show superior performance compared to previous DL models and GBDT family on previously proposed tabular benchmarks.

## Contributions

- A Retrieval Augmented Generation (RAG) inspired for tabular data classification.
- Modified mechanism for similarity calculation (and thus retrieval).

## Approach

- Resnet + clustering-like for RAG type.
- Attention-like mechanism to calculate _similarity_ scores.

![](/static/images/reading/tabr/mechanism.png)

Retrieval-based mechanism for tabular data classification.

![](/static/images/reading/tabr/similarity.png)

Similarity mechanism.

### Retrieval Mechanism

- Start with vanilla attention mechanism

$$
\mathcal{S}(\tilde x, \tilde x_i) = W_Q(\tilde x)^TW_K(\tilde x_i) \cdot d^{-1/2} \quad \mathcal{V}(\tilde x, \tilde x_i, y_i) = W_V(\tilde x_i)
$$

- Step-by-step description of modifying different components

  1. Context labels -- utilize the label of context object $x_i$ when calculating the _value_.
     $$
     \mathcal{S}(\tilde x, \tilde x_i) = W_Q(\tilde x)^TW_K(\tilde x_i) \cdot d^{-1/2} \quad \mathcal{V}(\tilde x, \tilde x_i, y_i) = \underline{W_Y(y_i)} + W_V(\tilde x_i)
     $$
  2. Change similarity module -- instead of using $W_Q$ and $W_K$, use just $W_K$ and instead use $L_2$ distance to calculate the similarity
     $$
     \mathcal{S}(\tilde x, \tilde x_i) = \underline{-\Vert W_K(\tilde x) - W_K(\tilde x_i) \Vert^2} \cdot d^{-1/2} \quad \mathcal{V}(\tilde x, \tilde x_i, y_i) = W_Y(y_i) + W_V(\tilde x_i)
     $$

  - In appendix, the authors discuss that:
    1. It's easier to align just 1 learned representation ($W_K$), instead of two ($W_Q$ and $W_K$).
    2. The encoder module $E$ is actually a _linear transformation_, meaning that similarity measures that work well in the _original_ space may also work well after applying $E$.
       - $E$ is a linear transformation because it's used very frequently (at each inference step to find the candidates). So it's better to have it be lightweight.

  3. Change the value module -- instead of using $W_V$, use $W_K$ and $W_Y$ to calculate the value.
     $$
     \mathcal{S}(\tilde x, \tilde x_i) = -\Vert W_K(\tilde x) - W_K(\tilde x_i) \Vert^2 \cdot d^{-1/2} \quad \mathcal{V}(\tilde x, \tilde x_i, y_i) = W_Y(y_i) + \underline{T(W_K(\tilde x) - W_K(\tilde x_i))}
     $$
     $$
     T(\cdot) = \text{LinearWithoutBias}(\text{Dropout}(\text{ReLU}(\text{Linear}(\cdot))))
     $$

  - Intuition: Add more information about the target sample $x$ into the value vector.
  - $W_Y(y_i)$ is the _raw contribution_ of sample $i$, where $T(W_K(\tilde x) - W_K(\tilde x_i))$ is the _correction_ term. $T(\cdot)$ translates the differences of $x$ and $x_i$ in the key-space ($W_K$) to the _label space_ ($W_Y$).

  4. Remove the scaling term $d^{-1/2}$ (artifact of vanilla attention anyways) from the similarity calculation.
     $$
     k = W_K(\tilde x), k_i = W_K(\tilde x_i) \quad \mathcal{S}(\tilde x, \tilde x_i) = - \Vert k-k_i \Vert^2 \quad \mathcal{V}(\tilde x, \tilde x_i, y_i) = W_Y(y_i) + T(k-k_1)
     $$

### Ablations

- Freeze context (encoded samples) after training starts to stablize.
- Online setting (start with limited data and add unseen)

## Findings

![](/static/images/reading/tabr/comparison.png)

TabR and previous DL models compared against XGB

![](/static/images/reading/tabr/comparison2.png)

TabR and previous DL models compared against GBDTs with and without HPO.

- Adding all of the 4 modifications is what makes TabR perform well.
- TabR beats GBDTs on _some_ datasets.
- Numerical embeddings and retrieval seem to be key techniques in good DL performance.

### Noted limitations

- While the new module is more efficient than standard attention, may still not scale too well.

## Resources

- [Github](https://github.com/yandex-research/tabular-dl-tabr)
