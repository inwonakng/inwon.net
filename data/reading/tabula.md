---
title: "Large Scale Transfer Learning for Tabular Data via Language Modeling"
summary: 'Summary of the paper "Large Scale Transfer Learning for Tabular Data via Language Modeling"'
draft: false
tags:
  - paper
  - tabular-data
  - deep-learning
  - language-model
  - machine-learning
  - transformers
  - table-to-text
date: 2024-10-08
images:
  - /static/images/reading/tabula/row-causal-mask.png
---

## Summary

This paper introduces TabuLa-8b, a LLaMA3-8b based model fine-tuned for tabular data classification. The authors examine its performance in _few-shot_ settings and find that the model fine-tuned for few-shot inference (TabuLa) vastly outperforms out-of-the box LLMs and is comparable to GBDT based baselines.

## Approach

### Model

#### Serialization

The authors opt for a natural-language style serialization of table rows. For example, the following table:

| date       | prediction | temp_max | weather |
| ---------- | ---------- | -------- | ------- |
| 2015-03-22 | 1.0        | 11.699   | rain    |
| 2015-09-19 | 0.0        | 14.722   | sun     |

Will turn into the following text:

```
Predict the value of weather: ||sun||rain||snow|| The date is 2015-03-22. The precipitation is 1.0. The temp_max is 11.699. What is the value of weather? ||sun||rain||snow|| <|endinput|> rain<|endcompletion|>Predict the value of weather: ||sun||rain|| snow|| The date is 2015-09-19. The precipitation is 1.0. The temp_max is 14.722. What is the value of weather? ||sun||rain|| snow||<|endinput|>sun<|endcompletion|>
```

Note that the serialization includes the column names as well as the possible values for each column. The model is then trained to predict the value of a column given the rest of the row. The authors also note that they they only consider cases where the model correctly "finishes" the sequence with `<|endcompletion|>` as correct.

#### Attention Mechanism

![Row Causal Tabular Mask](/static/images/reading/tabula/row-causal-mask.png)

> [!image/Row Cauasl Mask]
> Similar to causal masks used in language models, the row causal mask is used to ensure that the attention mechanism is only applied to cells from the same row.

The authors opt to use what they call "row causal mask" to prevent tokens from different rows to attend to each other. This is similar to the causal mask used in language models, but applied to the rows of the table. I think something similar existed in a while for batching multiple sentences [the 4d attention stuff](https://huggingface.co/blog/poedator/4d-masks). This also allows them to pack multiple sequences into **one input**, maximizing the use of the context at each input.

### Data Collection

Filtered and processed TabLib[^1] by:

- Filtering by table quality (missing values, non-tabular data, etc.)
- Automatically determine tasks (target columns to predict)

And end with 4M tables of 2.1B rows (~100B Llama3 tokens).

## Findings

### $k$-shot Inference

- Base LLama3 is worse than random guessing at $k=0$.
  - Adding a few examples improves performance significantly.
- TabuLa-8b shows superior performance at low $k$, but the gap starts to close between TabPFN[^2] and XGBoost as $k$ increases.
- In general, TabuLa-8b is **data efficient** (better performance in lower-data settings).

### Using Row Causal Mask

> [!setting]
> Training without the row causal mask results in significant performance drop.

- It degrades as $k$ increases -- suggesting that vanilla fine-tuning may lead to forgetting of the base model's few-shot capabilities.

### Usefulness of column heading

> [!setting]
> Replace column headings with uninformative tokens, e.g. `X1`, `X2`, etc.

- For small $k$, the model performs better with column headings.
- But as $k$ increases, the model performance gap closes.
  > [!intuition]
  > Maybe the model starts looking more at the cell "values" as $k$ increases, and the column headings become less important.
  > If this is true, we should be able to verify this by looking at the attention weights.

### Performance change with less features

> [!setting]
> Train XGB on the full (clean) data and compute feature importances. Use the importance scores to remove certain features for TabuLa. Compare against XGB that has been trained on partially corrupted (missing) data on the same test data.

- Higher $k$ for TabuLa shows stronger performance.
- Removing good features doesn't suddenly destroy performance -- only reasonable drops.

### Sensitivity to column ordering

> [!setting]
> Shuffle the columns of the tables for inference.

- Drop in performance, but still good performance.

### Performance on numerical/categorical columns

> [!setting]
> Inference only on tables that contain **at least one** or **all** numerical column(s).

- Performance on *some numerical* columns is still better than baselines.
- Performance on *all numerical* columns is **on par** with baselines.

## Resources

- [Paper](https://arxiv.org/abs/2406.12031)
- [Code -- Training](https://github.com/mlfoundations/rtfm)
- [Code -- Data Processing](https://github.com/mlfoundations/tabliblib)

[^1]: Eggert, Gus, Kevin Huo, Mike Biven, and Justin Waugh. "TabLib: A Dataset of 627M Tables with Context." arXiv preprint arXiv:2310.07875 (2023). [Approximate Labs Post](https://www.approximatelabs.com/blog/tablib)

[^2]: Hollmann, Noah, Samuel Müller, Katharina Eggensperger, and Frank Hutter. "Tabpfn: A transformer that solves small tabular classification problems in a second." arXiv preprint arXiv:2207.01848 (2022).

