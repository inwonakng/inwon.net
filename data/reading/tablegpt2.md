---
title: "TableGPT2: A Large Multimodal Model with Tabular Data Integration"
summary: 'Summary of the paper "TableGPT2: A Large Multimodal Model with Tabular Data Integration"'
tags:
  - paper-summary
  - tabular-data
  - language-model
  - deep-learning
  - table-to-text
date: 2024-11-10
draft: false
images:
  - /reading/_images/tablegpt2/semantic-table-encoder.png
  - /reading/_images/tablegpt2/agentic-framework.png
---

## Summary

A summary of TableGPT2, a fine-tuned Qwen2 based model for native tabular data processing.

## Approach

### Semantic Table Encoder

Similar to vision-language models, the authors opt to use a Q-former[^1] style adapter framework for aligning representation of table columns to the language model.

![Semantic Table Encoder](/static/images/reading/tablegpt2/semantic-table-encoder.png)

> [!image] Semantic Table Encoder
> A description of how the tabular data is directly encoded into tokens.
> Embeddings from the _encoder_ (stacks of col and row-wise attention blocks with no positional embeddings) are passed through an _adapter_ that combines them into a single representation of $k$ embeddings.

Then the table is serialized into a hybrid form of both text and embeddings:

```
table tab_name, columns=[tab_name.col_name(<col_emb>|dtype|if_primary_key)|[values]]
```

where `<col_emb>` is replaced with the $k$ embeddings from the adapter.

#### Encoder Pre-Training

The _encoder_ is pre-trained with a contrastive loss on the column embeddings.
A table $T_i$ is split into two snapshots $S_i$ and $S_i'$, and the encoder tries to pull together matching columns from $S_i$ and $S'_i$, while pushing apart the rest:

$$
\mathcal{L}(\tau, P) = -\frac{1}{|P|} \sum_{\mathbf{e}\in P} \log \cfrac{\exp(\mathbf{e}^\top\mathbf{e}_{+}/\tau)}{\sum_{\mathbf{e'} \in P\{\mathbf{e}} \exp(\mathbf{e}^{\top}\mathbf{e'}/\tau)}
$$

where $\tau$ is the temperature and $\mathbf{e}_{+}$ is the positive pair (embedding of same column) and $P$ is the pool of column embeddings from both $S_i$ and $S_i'$.

#### Encoder/Adapter Joint Training

To align the encoder's embeddings to the language model, both the encoder and the adapter are trained jointly on the following tasks:

Synthetically created tasks:

- column prediction
- cell prediction

Existing datasets (FetaQA, WikiTableQuestion, ToTTo) are modified to create more tasks:

- question generation
- table titling
- row summarization

### Data Collection

The authors collect two types of data for training TableGPT.

1. Text data for continuous pre-training of the Qwen2 base model.
2. Tabular data for supervised fine-tuning of the table encoder/adapter and language model.

| Type           | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| Database       | Multi-table setting, large and numerical                    |
| Web Page       | Simple and have contextual text data                        |
| Excel          | Structured data, government, finance, etc.                  |
| Academic Task  | data used in research, often suitable for TableQA or NL2SQL |
| Special Format | Specific formats, like invoice, bill, etc.                  |
| Pre-test Task  | Forcasting, prediction projects etc.                        |

> [!table] Types of tables gathered

Using this, the authors use larger models (GPT4-o, LLaMA, etc.) to generate a set of _queries_ of broadly two types:

- Single-turn
- Multi-turn -- where the user may ask to _improve_ the previous response or ask _additional_ question(s).

Once the queries are generated and vetted by human annotators, the larger models are again used to generate the _answers_ to these queries.
The authors employ a strategy they call **synthesize and refine** to generate higher-quality responses using these larger LLMs.

### Agent Framework

![Agentic Framework](/static/images/reading/tablegpt2/agentic-framework.png)

> [!image] Agentic Framework
> A core pipeline diagram of a agent framework using TableGPT2.

The authors propose an agent framework with TableGTP2. The tablular agent is able to generate code to parse/grab tables to achieve its task.

### Benchmarking

#### Existing Benchmarks

- **Table Understanding**
  - [TURL](https://github.com/sunlab-osu/TURL): table interpretation (e.g., column type annotation, relation extraction, entity linking) and table augmentation (e.g., row population)
- **Table Question Answering (TableQA)**
  - [WikiTableQuestion](https://github.com/ppasupat/WikiTableQuestions), [WikiSQL](https://github.com/salesforce/WikiSQL): answering natural language questions based on tabular data
  - [FeTaQA](https://github.com/Yale-LILY/FeTaQA): free-form answers.
  - [HybridQA](https://github.com/wenhuchen/HybridQA): multi-hop and table/text mix.
- **Table Fact Verification**
  - [TabFact](https://github.com/wenhuchen/Table-Fact-Checking), [FEVEROUS](https://github.com/Raldir/FEVEROUS)
- **Table-to-Text Generation (Table2Text)**
  - [ToTTo](https://github.com/google-research-datasets/ToTTo)
- **Natural Language to SQL (NL2SQL)**
  - [BIRD](https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/bird), [Spider](https://yale-lily.github.io/spider)
- **Holistic**
  - [TableBench](https://github.com/TableBench/TableBench) for assessing reasoning capabilities over tables.

#### RealTabBench

The authors argue that most existing benchmarks are too simple and fail to capture a real-life scenario. To remedy this, they propose a new tabular benchmarking for language models with the following assets:

- 360 real-life tables from business intelligence scenarios.
- 6,000 queries.

Human reviewers and LLMs are combined to produce the final metric.

## Findings

- TableGPT2 outperforms other models on RealTabBench.
- But it also retains most of its general-task (non-table related) capabilities.

The authors exclude TableLlama[^2] because it loses general-task capabilities.

## Resources

- [Paper](https://arxiv.org/abs/2411.02059)
- [Code -- TableGPT agent](https://github.com/tablegpt/tablegpt-agent)

[^1]: Li, Junnan, Dongxu Li, Silvio Savarese, and Steven Hoi. "Blip-2: Bootstrapping language-image pre-training with frozen image encoders and large language models." In International conference on machine learning, pp. 19730-19742. PMLR, 2023.
[^2]: Zhang, Tianshu, Xiang Yue, Yifei Li, and Huan Sun. "Tablellama: Towards open large generalist models for tables." arXiv preprint arXiv:2311.09206 (2023). [Huggingface link](https://huggingface.co/osunlp/TableLlama)

