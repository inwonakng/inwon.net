---
title: 'Can a Deep Learning Model be a Sure Bet for Tabular Prediction?'
date: 2024-12-17
tags:
  - paper
  - deep-learning
  - machine-learning
  - model-architecture
  - tabular-data
draft: false
summary: Summary of the paper "Can a Deep Learning Model be a Sure Bet for Tabular Prediction?"
images:
  - /static/images/reading/excelformer/overview.png
  - /static/images/reading/excelformer/hid-feat-mix.png
---

## Summary

Deep learning on tabular data faces three challenges:

1. **rotational variance** -- the order of columns should not matter.
2. **large data demand** -- DNNs have a _larger hypothesis space_, and require more training data compared to shallow algorithms.
3. **over-smooth solution** -- DNNs tend to produce overly smooth solutions. i.e. when faced with irregular decision boundaries, the learning algorithms suffer (as pointed out by [Grinsztajn et. al](/reading/why-do-trees.md)

## Approach

![Overview](/static/images/reading/excelformer/overview.png)

> [!image/Overview of aproach]
> 3 main components: Semi-Permeable Attention, Interpolation-based data-augmentation(Feat-mix, HID-mix), and Attentive FFNs.

### Semi-Permiable Attention

The authors propose to add a mask to the attention score matrix such that the _less important_ features **do not** influence _more important_ features, but the _more important_ features can influence the _less important_ features.

$$
z' = \text{softmax}(\cfrac{(z W_q) (z W_k)^T \underline{\oplus M}}{\sqrt{d}}) (z W_v)
$$

where $\oplus$ denotes element-wise addition and $\oplus M$ is the proposed change to vanilla MHSA. $M \in \mathbb{R}^{f \times f}$ is a fixed mask, where

$$
M[i,j] = \begin{cases}
  -\infty & I(\bf{f}_i) \gt I(\bf{f}_j) \\
  0 & I(\bf{f}_i) \leq I(\bf{f}_j)
\end{cases}
$$

where $I(\bf{f}_i)$ is the importance of the $i$-th feature. In other words, this terms means that _less informative features may use information from more informative features_ (case 0), but the opposite is blocked.

### Interpolation-based data-augmentation

![Picture of HID and FEAT mix](/static/images/reading/excelformer/hid-feat-mix.png)

> [!image/Illustration of HID and FEAT mix]
> HID-mix operates on the embedding level, while FEAT-mix operates on the feature level.

#### HID-mix

Given two samples $z_1^{(0)}, z_2^{(0)} \in \mathbb{R}^{f \times d}$ and their labels $y_1, y_2$, a new sample can be formed by mixing the embedding dimensions of $z_1^{(0)}$ and $z_2^{(0)}$:

$$
\begin{gather}
  z_m^{(0)} = S_H \odot z_1^{(0)} + (\mathbb{1}-S_H) \odot z_2^{(0)}\\
  y_m = \lambda_H y_1 + (1-\lambda_H) y_2
\end{gather}
$$

where $S_H \in \{0,1\}^{f \times d}$ is a stack of binary masks $s_h:S_H = [s_h, s_h,..., s_h ]^T$, where $\sum s_h = \left\lfloor \lambda_H \cdot d \right\rfloor$ for each row vector $s_h$, and $\mathbb{1}$ is a $f \times d$ matrix of $1$s. In other words, $S_H$ masks out $\left\lfloor \lambda_H \cdot d \right\rfloor$ entries of each row.

> [!intuition]
> Since each embedding element is projected from a scalar feature value, we can consider each embedding dimension as a distinct "profile" version of input data. Thus, Hid-Mix regularizes the classifier to behave like a bagging predictor.

#### FEAT-mix

Instead of mixing the _embedding_, FEAT-mix mixes the _features_ given two samples $x_1, x_2 \in \mathbb{R}^{f}$ and their labels $y_1, y_2$, a new sample can be formed by mixing the features of $x_1$ and $x_2$:

$$
\begin{gather}
 x_m = s_F \odot x_1 + (\mathbb{1}_F-s_F) \odot x_2 \\
  y_m = \Lambda y_1 + (1-\Lambda) y_2
\end{gather}
$$

where $s_F \in \{0,1\}^{f}$ is a binary mask vector where $\sum s_F = \left\lfloor \lambda_F \cdot f \right\rfloor$, $\mathbb{1}_F$ is a $f$ dimensional vector of $1$s, and $\Lambda$ is a scalar.

If we set $\Lambda = \lambda_F$, this equivalent to cutmix[^1].

To differentiate, the authors introduce the usage of _feature importance_ in the label weighting as follows:

$$
\Lambda = \cfrac{\sum_{s^{(i)_F}}I(\bf{f}_i)}{\sum_{i=1}^{\bf{f}}I(\bf{f}_i)}
$$

where $s_F^{(i)}$ is the $i$-th element of $s_F$, and $I(\bf{f}_i)$ is the importance of the $i$-th feature. Similarly to the SPA module, the _mutual information_ is what the authors appear to use.

> [!intuition]
> Since each feature may have different contribution to the label, weighing the two labels by how much "usefulness" each sample contributed allows uninformative features to be filtered.

### Attentive FFNs

Finally, the authors propose to replace the 2-layer FFN module at the end of the transformer block with a 2-layer Gated Linear Unit (GLU) module instead, like the following:

$$
z' = \text{tanh}(\text{Linear}_1(z)) \odot \text{Linear}_2(z)
$$

where $\odot$ is element-wise multiplication and the first term acts as the _gate_.

In addition, the authors replace the linear embedding layer with similar GLU setup as well, which used to be $z_i = \bf{f}_i W_{i,1} + b_{i,1}$, into $z_i = \text{tanh}(\bf{f}_i W_{i,1} + b_{i,1}) \odot \bf{f}_i W_{i,2} + b_{i,2}$.

However, why they do this is not very clearly motivated.

## Findings

- Excelformer works well on both small and large datasets!
  - While other models need HPO to be competitive, Excelformer is competitive without HPO.
- Both data augmentation methods are effective.

## Resources

- [Github](https://github.com/whatashot/excelformer)

[^1]: Yun, Sangdoo, Dongyoon Han, Seong Joon Oh, Sanghyuk Chun, Junsuk Choe, and Youngjoon Yoo. "Cutmix: Regularization strategy to train strong classifiers with localizable features." In Proceedings of the IEEE/CVF international conference on computer vision, pp. 6023-6032. 2019.
