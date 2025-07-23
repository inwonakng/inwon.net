---
aliases: []
tags:
  - paper-summary
  - language-model
  - meta-learning
  - model-architecture
  - tabular-data
date: 2025-07-23
summary: ''
title: 'ConTextTab: A Semantics-Aware Tabular In-Context Learner'
images:
  - /reading/_images/contexttab/overview.png
---

## Summary

A modified TabPFN architecture that uses language models to generate semantics-aware representation of tabular data.

## Approach

![Diagram of ConTextTab](/static/images/reading/contexttab/overview.png)

> [!image/Diagram of ConTextTab]

The authors propose a new architecture based on TabPFN called ConTextTab, which now incorporates a language model (bert) to generate semantics-aware features as input to the backbone PFN model.

### Encoding data types

**Text**: Encode using a lightweight LM (e.g. BERT) to generate embedding of the cell. Project to target dimension $d$ using a learned layer.
**Datetime**: Embed each number for year/month/day and take the sum.
**Numerical**: Use a learned linear layer (with bias) to project the value. If `NaN` use 0 as input, meaning bias alone is used to represent missing values.
**Column Headers**: Embed like `text`, and sum with the cell value embedding.

```
proj_text, proj_head: d_bert -> d
proj_num: 1 -> d
num_pr
if dtype == "text":
    cell_val = bert_encode(cell_value)
    cell_val = proj_text(x)
elif dtype == "datetime":
    cell_val = sum([linear_projection(year), linear_projection(month), linear_projection(day)])
else:
    cell_val = proj_num(cell_value)

header = bert_encode(column_header)
header = proj_head(header)
cell = cell_val + header
```

### Induced Set Attention

The row-wise attention mechanism is replaced with a set transformer([^1]), which can reduce the computation cost of attention by learning a set of $n$ "induced" inputs, which are then used to compute attention with the full set of inputs.

### Training

- Trained by filtering T4 dump from Tabula[^2] to get ~2M tables.
- Randomly select one target column, excluding all date columns, numerical columns with more than 50% NaN values, and other columns having more than 20% of unique values
- Throughput of 10 tables per second, with full training taking between 4 and 12 days on a single H100.

### Evaluation

**Datasets**
| Benchmark | Type |
|-|-|
| OpenML-CC18 | Classification only |
| OpenML-CTR23 | Regression only |
| TALENT | Classification and regression |
| TabReD| _Realistic_ (i.e. harder) classification and regression |
| CARTE | Classification and regression with semantics-heavy tasks |

**Baselines**
| Model | Notes |
|-|-|
| CARTE | State-of-the-art for CARTE benchmark |
| RealMLP| Strong performance in recent benchmarks|

\+ XGBoost, LightGBM, CatBoost and sklearn etc.

## Findings

- Highest _overall_ rank
  - Seems like it dominates on the CARTE benchmark, but not so much on others.
- Increasing parameter size or number of datasets stops being effective after a certain point.
  - Hypothesized bottleneck is from diversity of T4's datasets.
- Using label embedding information doesn't help much.
  - Most evaluation datasets don't have meaningful label values or headers, so using the extra embedding ends up not being very helpful.
- For **realistic/hard** datasets (TabReD), LGBM and XGB are still top. TabPFN also doesn't come close.
- Weight sharing across layers of TabPFN comes at little loss.
- **Strong performance in semantics-heavy benchmark** (CARTE benchmark)
- Performance improves monotonically with number of context examples.
  - Worth noting that during training, context size doesn't go over 900. But in inference, even more is still helpful.
- Ablating pre-training dataset size shows that **at least 100k tables are needed** to achieve good performance.
- No particular difference when using more recent/larger embedding models.

## Resources

- [Paper](https://arxiv.org/abs/2506.10707)
- [Code](https://github.com/SAP-samples/contexttab)

[^1]: Set transformer: A framework for attention-based permutation-invariant neural networks. ICML 2019. [pdf link](http://proceedings.mlr.press/v97/lee19d/lee19d.pdf)
[^2]: Large scale transfer learning for tabular data via language modeling. Neurips 2024. [pdf link](https://proceedings.neurips.cc/paper_files/paper/2024/hash/4fd5cfd2e31bebbccfa5ffa354c04bdc-Abstract-Conference.html)
