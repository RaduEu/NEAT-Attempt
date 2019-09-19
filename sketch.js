let t;
let connections = [];
let noInputs = 3;
let noOutputs = 3;

function setup() {
  createCanvas(700, 700);
  t = new genome(noInputs, noOutputs);
  /*for (let i = 0; i < noInputs * noOutputs; i++) {
    connections[i] = new connectionGene(t.nodes[i % noInputs], t.nodes[noInputs + floor(i / noInputs)], random(-1, 1), true, i);
    if(random()>0) connections[i].enabled=false;
  }*/
  t.connections = connections;
  //t.addConnectionMutation();
  //console.log(t.connections[0].fromNode, t.connections[0].toNode);
}

function keyPressed() {
  //console.log("A");
  if (keyCode == LEFT_ARROW) t.addConnectionMutation();
  else if (keyCode == RIGHT_ARROW) t.addNodeMutation();
}

function mousePressed() {

  for(let c of t.connections) if(c.enabled) console.log(c.fromNode.number,c.toNode.number);
  //for(let n of t.nodesInOrder) console.log(n.number,n.layer,n.input,n.output);
  //t.addNode(con);
  //t.addConnectionMutation();
}

function draw() {
  background(220);
  t.feedForward([1, 1, 1, 1]);
  //t.connections[0].mutate();
  t.show();
  //noLoop();
}