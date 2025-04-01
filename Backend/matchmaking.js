class DynamicMatchmaking {
    constructor() {
      this.queue = [];
      this.pairs = [];
      this.activePlayers = new Set();
    }
  
    addPlayer(id) {
      if (this.activePlayers.has(id)) return; // Prevent duplicate entries
      this.activePlayers.add(id);
      this.queue.push(id);
      this.checkAndPair();
    }
  
    leaveMatch(id) {
      if (!this.activePlayers.has(id)) return; // If already left, do nothing
      this.activePlayers.delete(id); // Remove from active players
  
      // Remove from queue (if waiting)
      this.queue = this.queue.filter(player => player !== id);
  
      // Find and remove the pair (if already matched)
      let remainingPlayer = null;
      this.pairs = this.pairs.filter(pair => {
        if (pair.includes(id)) {
          remainingPlayer = pair.find(player => player !== id); // Get the other player
          return false; // Remove the pair
        }
        return true;
      });
  
      // If there was a remaining player, re-add them to the queue
      if (remainingPlayer) {
        this.queue.push(remainingPlayer);
      }
  
      this.checkAndPair(); // Try to pair remaining players
    }
  
    checkAndPair() {
      while (this.queue.length >= 2) {
        let pair = [this.queue.shift(), this.queue.shift()];
        this.pairs.push(pair);
      }
    }
  
    getPairs() {
      return this.pairs;
    }
  }
  
  // Example usage
  const matchmaking = new DynamicMatchmaking();
  matchmaking.addPlayer(1);
  matchmaking.addPlayer(2);
  matchmaking.addPlayer(3);
  matchmaking.addPlayer(4);
  console.log("Initial Pairs:", matchmaking.getPairs()); // [[1,2], [3,4]]
  
  matchmaking.leaveMatch(2); // Player 2 leaves
  console.log("After 2 leaves:", matchmaking.getPairs()); // [[3,4]] (1 is now alone)
  
  matchmaking.addPlayer(5); // Player 5 joins
  console.log("After adding 5:", matchmaking.getPairs()); // [[3,4], [1,5]]
  