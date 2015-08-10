# subcolor
List of colors and subcolors ad infinitum

# What is this.

Given a number n (integer between 3 and 10), this generates an object containing a list of n "equally spaced" colors.
Then for each color, it generates a sublist of n colors that remain in that color palette.
This can be repeated recursively, although the colors will converge fairly fast.

# Example

With n=3, the first layout would generate a shade of Green, Red and Blue.
At the second layer, the Green will be associated with 3 other greens (that are distinct from the parent). The red will be associated with 3 new shades of red etc.

# Why is this useful

Assume you represent data within a tree and need each node on the tree to be matched to a color.
It would be nice that when going down the tree, there is a color convergence.

# What does "equally spaced" mean

Using the HSL model for colors on a screen, this method makes sure the entire hue Spectrum is used, as well as almost all the Lightness spectrum.
The Saturation is left constant to keep a unified feelings on all colors.
Choosing equidistant points within a closed 2d square is hard (NP hard), and is called the Packing Problem.
To avoid this, precomputed values of equidistant points in a square are used.
These values are pulled from:
http://www.ime.usp.br/~egbirgin/packing/packing_by_nlp/numerical.php?table=csq-mina

