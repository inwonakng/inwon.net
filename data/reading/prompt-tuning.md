---
title: "The Power of Scale for Parameter-Efficient Prompt Tuning"
summary: "Summary of the original prompt tuning paper."
tags:
  - paper-summary
  - fine-tuning
  - language-model
  - nlp
  - pretrained-model
  - promt-tuning
date: 2025-01-21
draft: false
images:
  - /static/images/reading/prompt-tuning/compare-model-tuning.png
---

## Summary

This paper proposes prompt-tuning, learning a set of soft-prompts in the latent space instead of using natural language.

## Approach

![Comparison against model tuning](/static/images/reading/prompt-tuning/compare-model-tuning.png)

> [!image/Comparison of prompt-tuning vs traditional model-tuning]
> Model tuning ends up creating different _versions_ of the model specialized for each task, while prompt-tuning maintains one base model and only learns the task specialized prompts.

The authors examine prompt-tuning by transforming a T5 model into a language model (instead of the original reconstruction task).

### Prompt initialization strategies

- Random initialization
- Use pre-trained vocabulary
- (For classification) Use pre-trained vocabulary to encode the **classification targets**.

### Domain shift

- The authors argue that because prompt-tuning does not modify the _generalist_ weights of the language model but rather modify the representation of the _input_ to be _task specific_, prompt-tuning may be more resilient to domain shift.
- This is tested by training/testing on OOD dataset groups.

### Ensembling

- Prompt-tuning can be a cheap alternative for **ensembling**.
- By learning $N$ sets of prompt tokens, one can simply construct a batch of $N$ inputs with each prompt and compute the output in **one forward pass**

## Findings

- Prompt tuning becomes more comparable to model-tuning as model size increases
- Prompt tuning does show more resilience to domain shift compared to model fine-tuning.
- The learned prompts end up in a semantically meaningful position in the model's vocab space.
  - The nearest neighbors of each learned prompt often form a coherent cluster.
  - When encoding the classification target, the final prompt still shows similarity to the encoded target values.
  - This also shows better performance over single-prompt tuning.
- The ensemble approach yields better performance than single-prompt settings.

## Resources

- [Paper](https://aclanthology.org/2021.emnlp-main.243/)
- [Code](https://github.com/google-research/prompt-tuning)
