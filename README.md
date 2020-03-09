<h1 align="center">Ikarus Seeker</h1>

<p align="center">
  <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Gowy-icaro-pradoFXD.jpg/800px-Gowy-icaro-pradoFXD.jpg' height="300">
</p>

<p align="center">"Fly, on your way, like an eagle. Fly as high as the sun."</p>

### Install:

```bash
npm install
```

### Usage

#### Command line parameters:

|Parameter          |Description      |Example    |Required
|-------------------|-----------------|-----------|--------
| -t or --to        | Origin          |SAO        |yes
| -f or --from      | Destination     |BEL        |yes
| -d or --departure | Departure date  |2020-12-12 |yes
| -r or --return    | Return date     |2021-01-08 |yes
| -m or --maximum   | Maximum price   |560,15     |no

#### Example:

```bash
node index.js -t SAO -f BEL -d 2020-03-09 -r 2020-04-05 -m 1000
```

### Supported companies / agencies:

* GOL
* LATAM
* Azul
* Avianca

