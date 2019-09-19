class connectionGene {
  constructor(fromNode, toNode, weight, enabled, innovationNumber) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.weight = weight;
    this.enabled = enabled;
    this.innovationNumber = innovationNumber;
  }

  mutate(){
    let r  = random(-1,1);
    this.weight=r;
  }
  
  debug() {
    console.log(this.fromNode + " " + this.toNode + " " + this.weight + " " + this.enabled + " " + this.innovationNumber);
  }
  
  //we need the fromNode and toNode parameters because the nodes will be copies
  copy(fromNode,toNode){
    let c = new connectionGene(fromNode,toNode,this.weight,this.enabled,this.innovationNumber);
    return c;
  }
}