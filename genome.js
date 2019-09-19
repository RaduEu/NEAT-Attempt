class genome {
  constructor(noInputs, noOutputs) {
    this.connections = []; // [connectionGene]
    this.nodes = []; // [nodeGene]
    this.noInputs = noInputs; // no of input nodes
    this.noOutputs = noOutputs; // no of output nodes
    this.currNodeIndex = 0; // the curent number of nodes
    this.nodesInOrder = []; // used to activate neurons in the right order
    this.biasNodeIndex = -1; //bias neuron
    this.noLayers = 2; // number of layers

    //create input neurons
    for (let i = 0; i < noInputs; i++) {
      this.nodes[i] = new nodeGene(this.incCurrNodeIndex());
      this.nodes[i].pos = createVector(30 + (width - 30) / noInputs * i, 30);
      this.nodes[i].layer = 0;
    }

    //create output neurons
    for (let i = 0; i < noOutputs; i++) {
      this.nodes[noInputs + i] = new nodeGene(this.incCurrNodeIndex());
      this.nodes[noInputs + i].pos = createVector(30 + (width - 30) / noOutputs * i, height - 30);
      this.nodes[noInputs + i].layer = 1;
    }

    this.biasNodeIndex = this.incCurrNodeIndex();
    this.nodes[this.biasNodeIndex] = new nodeGene(this.biasNodeIndex);
    this.nodes[this.biasNodeIndex].layer = 0;
    this.nodes[this.biasNodeIndex].pos = createVector(10, height / 2);

    // connect them together
    this.connectNodes();
    //console.log(this.nodes);
  }

  // produces output of the network, given inputs
  feedForward(inputs) {

    this.connectNodes();

    for (let i of this.nodes) {
      i.input = 0;
      i.output = 0;
    }

   // console.log()
   // console.log(this.connections[0].fromNode.input, this.connections[0].fromNode.output, this.connections[0].toNode.input, this.connections[0].toNode.output);


    for (let i = 0; i < this.noInputs; i++) {
      this.nodes[i].input = inputs[i];
    }
   // console.log("CLEARED?", this.connections[0].toNode.input);
    this.nodes[this.biasNodeIndex].input = 1;

    this.orderNodes();

    for (let i = 0; i < this.nodesInOrder.length; i++) {
      this.nodesInOrder[i].activate();
    }
   // console.log("FROM", this.connections[0].fromNode.input, this.connections[0].fromNode.output, "TO", this.connections[0].toNode.input, this.connections[0].toNode.output);

    for (let i of this.nodes) i.input = 0;

  }

  // orders nodes according to when they will be activated
  orderNodes() {
    this.nodesInOrder=[];
    for (let i = 0; i < this.noLayers; i++) {
      for (let n of this.nodes)
        if (n.layer == i) this.nodesInOrder.push(n);
    }
  }

  //muation to add a new connection
  addConnectionMutation() {
    this.connectNodes();
    let noTries = 1;
    let fromNode = random(this.nodes);
    let toNode = random(this.nodes);
    //console.log(fromNode.connections);
    // console.log(toNode.connections);
    let p = this.canConnect(fromNode, toNode);
    while (noTries < 100 && (!this.canConnect(fromNode, toNode) || toNode.number == this.biasNodeIndex)) {
      fromNode = random(this.nodes);
      toNode = random(this.nodes);
      noTries++;
    }
    if (noTries == 100) return;
    if (fromNode.layer > toNode.layer) {
      let temp = fromNode;
      fromNode = toNode;
      toNode = temp;
    }
    let newConnection = new connectionGene(fromNode, toNode, random(-1,1), true, 0) // TODO : from, to, Innovation number
    if (fromNode.layer > toNode.layer) console.log("OOF");
    this.connections.push(newConnection);
  }

  //mutation to add a new node
  addNodeMutation() {
    if (this.connections == []) return;
    let con = random(this.connections);
    let noTries = 1;
    while (noTries < 100 && (!con.enabled||con.fromNode.number==this.biasNodeIndex)) {
      noTries++;
      con = random(this.connections);
    }
    if (noTries == 100) return;
    this.addNode(con);
  }

  //adds a new node on a connection
  addNode(connection) {
    this.connectNodes();
    //console.log("FROM NODE",connection.fromNode.number,"LAYER", connection.fromNode.layer,"TO NODE", connection.toNode.number,"LAYER", connection.toNode.layer);
    let newNode = new nodeGene(this.incCurrNodeIndex());
    newNode.pos.x = (connection.fromNode.pos.x + connection.toNode.pos.x) / 2;
    newNode.pos.y = (connection.fromNode.pos.y + connection.toNode.pos.y) / 2;
    newNode.layer = connection.fromNode.layer + 1;
    if (newNode.layer == connection.toNode.layer) {
      for (let i = 0; i < newNode.number; i++)
        if (this.nodes[i].layer >= newNode.layer) this.nodes[i].layer++;
      this.noLayers++;
    }
    let newCon1 = new connectionGene(connection.fromNode, newNode, 1, true, 0);
    let newCon2 = new connectionGene(newNode, connection.toNode, connection.weight, true, 0);
    let biasConnection = new connectionGene(this.nodes[this.biasNodeIndex],newNode,0,true);
    this.connections.push(newCon1);
    this.connections.push(newCon2);
    this.connections.push(biasConnection);
    this.nodes.push(newNode);
    connection.enabled = false;
  }

  //connects the nodes according to the connections
  connectNodes() {
    for (let n of this.nodes) n.connections = [];
    for (let c of this.connections) c.fromNode.connections.push(c);
  }

  //shows this genome
  show() {
    push();
    for (let c of this.connections) {
      //if(c.weight==undefined) console.log(c);
      if (!c.enabled) continue;
      strokeWeight(1 + abs(c.weight) * 2);
      if (c.weight == 0) stroke(128);
      else if (c.weight > 0) stroke(0, 255, 0);
      else stroke(255, 0, 0);
      line(c.fromNode.pos.x, c.fromNode.pos.y, c.toNode.pos.x, c.toNode.pos.y);
    }
    strokeWeight(10);
    stroke(0);
    for (let n of this.nodes) {
      point(n.pos.x, n.pos.y);
      fill(255);
      strokeWeight(1);
      text(n.input + " " + n.output + " " + n.number + " " + n.layer, n.pos.x, n.pos.y);
      strokeWeight(10);
    }
    pop();
  }

  //auxiliary function
  incCurrNodeIndex() {
    this.currNodeIndex++;
    return this.currNodeIndex - 1;
  }

  // checks if from and to cannot be connected for some reason
  canConnect(from, to) {
    //console.log(from,to);
    if (from.layer == to.layer) return false;
    for (let x of from.connections)
      if (x.toNode.number == to.number) return false;
    for (let x of to.connections)
      if (x.toNode.number == from.number) return false;
    return true;
  }

  fullyConnected() {
    for (let from of this.nodes) {}
  }

}