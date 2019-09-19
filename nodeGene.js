class nodeGene {
  constructor(nodeNo) {
    this.number = nodeNo;
    this.input = 0;
    this.output = 0;
    this.connections = []; // [connectionGene]
    this.layer = 0;
    this.pos = createVector();
  }

  copy(){
    let c = new nodeGene(this.number);
    c.layer=this.layer;
    return c;
  }
  
  activate() {
    //console.log(this.connections);
    //if (this.connections.length > 0) console.log("INPUT:", this.number, this.input, this.output,"OUTPUT",this.connections[0].toNode.number);
    this.output = this.input;
    if(this.layer>0) this.output=this.sigmoidActivation(this.output);
    for (let c of this.connections)
      if (c.enabled) {
       // console.log("BEFORE:", c.toNode.input, "AFTER", c.toNode.input + this.output * c.weight);
        c.toNode.input += this.output * c.weight;
      }
  }

  sigmoidActivation(x) {
    return 1 / (1 + exp(-x));
  }

  stepActivation(x) {
    if (x < 0) return 0;
    return 1;
  }
}