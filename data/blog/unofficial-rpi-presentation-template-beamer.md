---
title: Unofficial RPI presentation template for beamer
date: '2024-01-30'
tags: 
  - latex
  - beamer
  - presentation
draft: false
summary: Unofficial RPI presentation template for beamer.
images: 
  - /static/images/blog/unofficial-rpi-presentation-template/overleaf-compiler.png
  - /static/images/blog/unofficial-rpi-presentation-template/overleaf-menu.png
  - /static/images/blog/unofficial-rpi-presentation-template/plain.png
  - /static/images/blog/unofficial-rpi-presentation-template/title.png
  - /static/images/blog/unofficial-rpi-presentation-template/plain.png
  - /static/images/blog/unofficial-rpi-presentation-template/list.png
  - /static/images/blog/unofficial-rpi-presentation-template/figures.png
  - /static/images/blog/unofficial-rpi-presentation-template/table.png
  - /static/images/blog/unofficial-rpi-presentation-template/textbox.png
  - /static/images/blog/unofficial-rpi-presentation-template/bib.png
  - /static/images/blog/unofficial-rpi-presentation-template/toc.png
  - /static/images/blog/unofficial-rpi-presentation-template/progress.png
  - /static/images/blog/unofficial-rpi-presentation-template/references.png
---

A beamer presentation template I made using RPI colors and official logo.

[Source for RPI color and logo](https://scer.rpi.edu/brand-in-action/colors)

## Usage

Copy the `beamerthemeRPI.sty` file to the directory of your `.tex` file.
Also copy the `logos` to the same directory (that the `tex` file lives in).
This is required for because the logos need to be rendered at the footer of each slide.

You also need to use `lualatex` compiler instead of `pdflatex` because of the font. (Arial doesn't work on pdflatex?)

If you are on overleaf, you can do this:

![](/static/images/blog/unofficial-rpi-presentation-template/overleaf-menu.png)

First open the menu

![](/static/images/blog/unofficial-rpi-presentation-template/overleaf-compiler.png)

And then select either `LuaLaTeX` or `XeLaTeX` as the compiler.

## Previews

### Title Page
![](/static/images/blog/unofficial-rpi-presentation-template/title.png)

### Regular Page
![](/static/images/blog/unofficial-rpi-presentation-template/plain.png)

### List
![](/static/images/blog/unofficial-rpi-presentation-template/list.png)

### Figure(s)
![](/static/images/blog/unofficial-rpi-presentation-template/figures.png)

### Table(s)
![](/static/images/blog/unofficial-rpi-presentation-template/table.png)

### Textblocks
![](/static/images/blog/unofficial-rpi-presentation-template/textbox.png)

### Using bib
![](/static/images/blog/unofficial-rpi-presentation-template/bib.png)

### Table of Contents
![](/static/images/blog/unofficial-rpi-presentation-template/toc.png)

### Section Progress
![](/static/images/blog/unofficial-rpi-presentation-template/progress.png)

### Citations
![](/static/images/blog/unofficial-rpi-presentation-template/references.png)

## Links
[Github](https://github.com/inwonakng/unofficial-rpi-presentation-template)

