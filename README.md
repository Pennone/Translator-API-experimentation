![](./assets-readme/logo.svg)

## 1. [PROJECT IDEA](#project-idea)

### a. Theme

### b. Aim / goal

### c. Concept

### d. Context of use

## 2. [STRUCTURE](#structure)

## 3. [CODE](#code)

### a. Face recognition

### b. Generative art

### c. Style

### d. Challenges

### e. References and tutorials

## 4. [TEAM](#team)

![](./assets-readme/looptext.gif)

# PROJECT IDEA

**THEME**

The project is inspired by the world of neural machine translators, such as the well known Google Translate. The system they are built upon is an interesting look at how we value languages, and how dipendent we can be from English as a lingua franca; this of course could lead to some mistake (in most contexts hilarious), mitigated by the neural network system that predicts the likelihood of the sequence of words, typically modeling entire sentences in a single integrated model.
An important step for the comprehension of the theme is the translation of the phrase into a vector, that allows the algorythm to "navigate" between languages.

**AIM**

The goal of the project is to make people connect with this system that we take for granted, comprehending dynamics too often overlooked. In addition we just wanted to create a pleasant experience, entertaining for the naturally funny ways phrases can be distorted when "traveling" metaphorically through continents and literally through languages.

**CONCEPT**

The project is designed for a single user; they will need to press the big button on the screen to start recording their phrase (in English), inputted through voice recognition. After that, an animation will represent the transformation of the phrase into vector, taking account of all the different parts of it. Then a map of the globe will be shown, and the user will be able to choose a language for every continent of the world; the original phrase will be then translate in every language chosen, in the set order. This will be shown with an animation composed of text and arrows.
As the last step, the user will be able to observe its phrase get back to them, translated again in English, seeing it besides the orginal, and look at the way it will be slightly or majorly different.

**CONTEXT OF USE**

Our project has been designed as an installation/exhibit; the installation is held in a closed room where the entrance is suggested to one single person at a time, even if more can access as long as they dont cause noise, that will need to position themselves in front of a tablet. This is the case because our voice recognition library has shown itself to misbehave if near sources of noise.
The device will need to have touch functionalities and a microphone of course, being touch and speech the only ways to communicate with the project.

# STRUCTURE

![scheme](./assets-readme/schema.png)

The project is composed of a single HTML page, in which the various parts are set to go off based on timers and the interaction of the user with a button and some drop-down menus.

1. The introduction page invites the user to press the big button on the screen;
2. Then the user will be able to talk, spelling the sentence to be translated in english;
3. The phrase will be then translated into a language for every continent, chosen from a selected pool, in the set order;
4. After the last translation, the phrase will be translated again in English, to be confronted with the starting one;

# CODE

**FACE RECOGNITION**

[face-api.js ](justadudewhohacks.github.io) was implemented for face detection and face recognition. In our specific case, we used the facial expression recognition model. All the code containing the instruction to load the face-api library and detect the faces is cointained in the [script.js](./public/script.js) file.

The library is able to detect and differentiate between 7 different expressions: happiness, sadness, anger, disgust, surprise, fear and neutral.

**GENERATIVE ART**

The two blobs are created through the use of generative art based on the different emotions. To create them, we used a class called Organic, which contains the single layers that compose each blob

```JavaScript
class Organic {
  constructor(id, radius, pos, roughness, angle, color) {
  this.id = id;
  this.radius = radius; //radius of blob
  this.pos = pos;
  this.roughness = roughness; //magnitude of distortion
  this.angle = angle; //angle of rotation
  this.color = color; //color of the blob
  this.xSpeed = 1;
  this.ySpeed = 1;
}
```

and then we overlapped various layers in a Blob class to create the effective blob.

```JavaScript
class Blob {
  constructor(id, x, y) {
    this.id = id;
    this.pos = createVector(x, y);
    this.startPosition = createVector(x, y);
    this.grown = false;
    this.vel = createVector();
    this.acc = createVector();
    this.organics = [];
    this.n_blobs = 10;
    this.createOrganics();
    this.change = 0;

    this.intensity = 0;
    this.expressions = { prev: "neutral", next: "neutral" };
    this.properties = {
      color: color(89, 84, 87),
      changeIncrement: 0,
      offset: 0,
    };

    this.prevProp = {};
    this.nextProp = {};

    this.expressionList = {};

    this.neutral = false;
    this.change = 0;
    this.transition = false;
  }

  createOrganics() {
    for (let i = 0; i < this.n_blobs; i++) {
      this.organics.push(
        new Organic(
          i,
          10,
          this.pos,
          i * 10,
          i * random(90),
          expressions_properties.neutral.color
        )
      );
    }
  }
```

The movement of each blob is influenced by two points: one in the middle of the screen and one on the side of the screen where the blob stands; the blob on the right will be attracted by the middle and the right point, while the one on the left will be attracted to the middle and the left point.

```JavaScript
  attracted(target, intensity) {
    let force = p5.Vector.sub(target, this.pos);
    let d = force.mag();
    d = constrain(d, 1, 100);
    const G = 50;
    const speed = 40;
    const strength = G / d;

    if ((d < 5 && intensity > 0.5) || detections.length < 2) this.vel.set(0, 0);
    else {
      if (intensity == 0) intensity = 0.1;
      const mag = (strength * intensity * speed) / d;
      force.setMag(mag);
      this.acc.add(force);
    }
  }
```

When the two expressions are in sync, the objects will be attracted by the point in the middle and repulsed by the respective external points, whereas different expressions will pull the two blobs towards the respective external points and push them away from the middle one.

```JavaScript
if (screen_2) {
  // Intensity of central point (-2, 2) --> 0-100%
  let mappedI = map(sync.curr, 0, 100, -2, 2);
  // Intensity of side point (-1, 1) --> 100-0%
  let mappedI_2 = map(sync.curr, 0, 100, 1, -1);
  b.attracted(a0, mappedI);
  b.pos.x < width / 2
    ? b.attracted(a1, mappedI_2)
    : b.attracted(a2, mappedI_2);
  b.update(); // Update blobs' postition
      }
```
![](./assets-readme/blob_avvicinano.gif)

**STYLE**

To manage the texts appearing in the various parts of the experience, we implemented a CSS file; both the dissolving transitions in the centre of the screen and the scrolling transitions on the top and the bottom of the page are handled though the [style.css](./public/style.css).

**CHALLENGES**

We tried to use face-api implementing [ML5](https://ml5js.org/), an open source library which simplifies the use of machine learning libraries; however ML5 does not support face-api, so we had to directly download and install it.
The main challenges we faced came from the implementation of the face-api library and, consequently, assigning each expression to a specific variable. The library is set to recognize 7 different emotions; unfortunately, especially when the code is set to analyse more than one face, it has some difficulties to differenciate between fear, disgust and anger.

Each expression is characterized by a color (chosen after a study on the topic of color emotion), a rotation and a type of movement, for example:

```JavaScript
happy: {
      color: color(230, 13, 100),
      changeIncrement: 0.03,
      offset: 0.1,
    }
```

For every detection we obtain the strongest expression and we assign it to the blob.

```JavaScript
function getFaceElements() {
  detections.forEach((d, index) => {
    if (screen_1)
      blobs[index].pos.x =
        d.detection._box._x > 200 ? startPositions[0] : startPositions[1];

    blobs[index].expressionList = d.expressions;

    let expValue = 0;
    let c_exp = "";
    let i = 0;

    for (const e in d.expressions) {
      const value = e === "neutral" ? d.expressions[e] * 0.1 : d.expressions[e];
      if (value > expValue) {
        c_exp = e;
        expValue = value;
      }

      //  Display expressions values
      if (screen_2) {
        drawExpressionValues(e, d.expressions, index, i);
        i++;
      }
    }

    blobs[index].expressions.prev = blobs[index].expressions.next;
    blobs[index].expressions.next = c_exp;
    const prev = blobs[index].expressions.prev;
    const next = blobs[index].expressions.next;

    blobs[index].intensity = d.expressions[c_exp];
```

A challenging part was to make the Blobs continuously transition between the expressions' properties. Since the detections happen every 1000ms the transition must happen in that interval.

```JavaScript
    // Fluid transition between states
    if (prev != next) {
      console.log("%cTRANSITION!", "font-weight:bold; color:red");
      console.log(`${prev} --> ${next}`);
      blobs[index].transition = true;
      timeStamp = Date.now();
      blobs[index].prevProp = expressions_properties[prev];
      blobs[index].nextProp = expressions_properties[next];
    }

    if (blobs[index].transition) {
      blobs[index].propertiesTransitions(timeStamp);
    } else if (!blobs[index].transition) {
      blobs[index].properties.color = expressions_properties[next].color;
    }

});
```

```JavaScript
  // In Blob.js
  propertiesTransitions(lastTimestamp) {
    const now = Date.now();
    const interval = 1000;
    const amt = (now - lastTimestamp) / interval;

    const c1 = this.prevProp.color;
    const c2 = this.nextProp.color;

    this.properties.color = lerpColor(c1, c2, amt);
    this.properties.changeIncrement = lerp(
      this.prevProp.changeIncrement,
      this.nextProp.changeIncrement,
      amt
    );
    this.properties.offset = lerp(
      this.prevProp.offset,
      this.nextProp.offset,
      amt
    );
    this.properties.color.setAlpha(alpha);

    if (amt >= 1) this.transition = false;
  }
```
![](./assets-readme/transizioni_blob.gif)

The same method is used to transition between every sync percentage and to make the background fade to black at the end.

To obtain the synchronization value we made an operation of Shallow Equality between the two objects.

```JavaScript
if (detections.length == 2) {
sync.prev = sync.next;
sync.next = shallowEquity(blobs[0].expressionList, blobs[1].expressionList);
```

```JavaScript
function shallowEquity(obj1, obj2) {
  const keys = Object.keys(obj1);
  let diff = 0;
  for (let key of keys) {
    if (key != "neutral") {
      const delta = abs(obj1[key] - obj2[key]);
      diff += delta;
    }
  }
  // Create object with % of every expression
  let perc = map(diff, 0, 2, 100, 0);
  return round(perc, 1);
}
```

Another challenging aspect was how to handle the presence of zero, one, two or more people in front of the screen and how to make the blobs react. In the end, we came up with this solution, in the manageBlobs() function:

- if there is no one in front of the screen, the blobs will be neutral

```JavaScript
for (let i = 0; i < blobs.length; i++) {
    blobs[i].neutral = true;
    blobs[i].change += expressions_properties.neutralchangeIncrement;
    blobs[i].showBlobs();
  }
```

- if there is one person in front of the screen, the blob corresponding to the person will activate on the side where the person is located

```JavaScript
if (detections.length == 1 && !expansion) {
  blobs[1].pos.x =
    blobs[0].pos.x < width / 2 ? startPositions[1] : startPositions[0];
  blobs[1].neutral = true;
}
```

- if there are two people in front of the screen, the animation of each blob will depend on the person standing in front of it and will correspond to the phisical side where the face is located

```JavaScript
function getFaceElements() {
 detections.forEach((d, index) => {
    if (screen_1)
      blobs[index].pos.x =
        d.detection._box._x > 200 ? startPositions[0] : startPositions[1];
```

Lastly, we tried to implement a background sound to accompany the whole experience; however, we experienced some troubles as the sound library conflicts with the function createVector that we used in [Blob.js](./public/blob.js), so we decided to abandon the idea.

**REFERENCES AND TUTORIALS**

[Build Real Time Face Detection With JavaScript](https://www.youtube.com/watch?v=CVClHLwv-4I&t=183s&ab_channel=WebDevSimplified)

[Daniel Shiffman - The coding train](https://thecodingtrain.com/)

[Coding Challenge #56: Attraction and Repulsion Forces](https://www.youtube.com/watch?v=OAcXnzRNiCY)

# TEAM

[Valentina Bettoni](https://www.behance.net/valentibettoni)

[Alessio Brioschi](https://www.behance.net/alessiobrioschi1)

[Mara Castiglioni](https://www.behance.net/maracastiglioni)

[Sara Gussoni](https://www.behance.net/saragussoni/projects)

[Romario Muca](https://www.behance.net/romario2/projects)

**COURSE**

[Creative Coding 2021/2022](https://drawwithcode.github.io/2020/)

**Politecnico di Milano** - Scuola del Design

**Faculty:** Michele Mauri, Andrea Benedetti, Tommaso Elli.
