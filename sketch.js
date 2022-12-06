let myFriends = ["Bepe", "Beppe", "Sbeppe", "Giuppe"]
let myBool = true;

let cont = 0;

function setup() {
  createCanvas(500, 500);

  angleMode(DEGREES);

  frameRate(60);

  console.log(myFriends);

  let NewFriend = "Urpel";
  myFriends.push(NewFriend)

  console.log(myFriends);

  let RandomFriend = random(myFriends);
  let PoppedFriend = myFriends.pop();

  console.log(myFriends);
  console.log(PoppedFriend);
  console.log(RandomFriend);

  // other stuff
  const inc = 25;
  for (let x = 12.5; x < width; x += inc){
    for (let y = 12.5; y < height; y += inc){
      //console.log(x, y);
      const randomValue = random();
      const r = random(0, 255);
      const g = random(0, 255);
      const b = random(0, 255);
      if (randomValue < 0.5) {
        noStroke();
        fill(r, g, b);
      } else {
        stroke(r, g, b);
        noFill();
      }
      ellipse(x, y, inc*randomValue);
    }

    //Math.round(random(0, 100))

    //const y = noise(1)
  }

  noStroke();
}

function draw() {

  if (myBool == true){
    cont += 0.01;
  } else {
    cont -= 0.01;
  }

  //create color values
  let mycolor = lerpColor(color("red"), color("green"), cont);

  if (cont >= 1.25){
    myBool = false;
  } else if (cont <= 0){
    myBool = true;
  }
  //use them as a color
  fill(mycolor);
  //draw
  ellipse(mouseX, mouseY, 25, 25)

}
