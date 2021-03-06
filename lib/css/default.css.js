let css = `
* {
    font-family: inherit;
    color: inherit;
    font-size: 10;
    opacity: inherit;
    visibility: inherit;
    solid-style: inherit;
}

:root > g {
    font-family: Roboto-Regular;
    color: random;
}

.craftml-cut {
    display: none;
}

div, h1, h2, h3, h4, h5 {
    display: block;
    text-align: left;
}

braille {
    color: black;
}

h1 {
    font-size: 20;
}

h2 {
    font-size: 18;
}

h3 {
    font-size: 16;
}

h4 {
    font-size: 14;
}

h5 {
    font-size: 12;
}

stl {
    box-style: solid;
    box-color: pink;
    box-width: 1;
}
`

export default css
