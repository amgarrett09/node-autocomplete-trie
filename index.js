class TrieNode {
  constructor(char) {
    this.char = char;
    this.validWord = false;
    this.parent = null;
    this.children = [];
  }
}

class AutoComplete {
  constructor() {
    this.root = new TrieNode('');
  }

  add(word) {
    let current = this.root;

    for (let i = 0; i < word.length; i += 1) {
      const ch = word[i];
      let found = false;

      // Search all children for the character we're looking for
      for (let j = 0; j < current.children.length; j += 1) {
        const child = current.children[j];
        // If we find it, change current node to that child
        if (child.char === ch) {
          found = true;
          current = child;
          break;
        }
      }

      // If we don't find the char, create a new node
      if (!found) {
        current.children.push(new TrieNode(ch));

        const newNode = current.children[current.children.length - 1];

        newNode.parent = current;

        // On next iteration, start at node we just created
        current = newNode;
      }
    }

    // Set last created node to be a valid keyword endpoint
    current.validWord = true;
  }

  contains(word) {
    let current = this.root;

    // For each char in the word
    for (let i = 0; i < word.length; i += 1) {
      const ch = word[i];
      let found = false;

      // Search each child of the current node
      for (let j = 0; j < current.children.length; j += 1) {
        const child = current.children[j];

        if (child.char === ch) {
          found = true;
          current = child;
          break;
        }
      }

      if (!found) {
        return false;
      }
    }

    return current.validWord;
  }

  delete(word) {
    let current = this.root;

    for (let i = 0; i < word.length; i += 1) {
      const ch = word[i];
      let found = false;

      for (let j = 0; j < current.children.length; j += 1) {
        const child = current.children[j];

        if (child.char === ch) {
          found = true;
          current = child;
          break;
        }
      }

      if (!found) {
        return;
      }
    }

    current.validWord = false;

    // Clean up uneeded nodes
    let stop = false;
    while (!stop) {
      // If the current node has no children and is not a valid word endpoint
      if (
        current.children.length === 0
        && !current.validWord
        && current.parent
      ) {
        const { parent } = current;
        const childIndex = parent.children.indexOf(current);
        const end = parent.children.length - 1;

        // On the parent, swap the position of this node and the end of the array
        [parent.children[childIndex], parent.children[end]] = [
          parent.children[end],
          parent.children[childIndex],
        ];

        // Pop this node off the array
        parent.children.pop();

        // Repeat the test on the parent
        current = parent;
      } else {
        // Stop if current node has children or it's a word endpoint
        stop = true;
      }
    }
  }

  suggest(snip) {
    const chars = snip.split('');
    let current = this.root;

    // Find the node corresponding to the end of the snippet, if it exists
    for (let i = 0; i < chars.length; i += 1) {
      const ch = chars[i];
      let found = false;

      for (let j = 0; j < current.children.length; j += 1) {
        const child = current.children[j];

        if (child.char === ch) {
          found = true;
          current = child;
          break;
        }
      }

      if (!found) {
        return [];
      }
    }

    const suggestions = [];
    const tracker = []; // Helps track where we are in the tree traversal

    // Depth first search
    function recurse(node) {
      tracker.push(node.char);

      if (node.validWord) {
        // Put letters in tracker on end of input snippet, and push into suggestions
        const temp = chars.slice(0, snip.length - 1);
        temp.push(...tracker);
        suggestions.push(temp.join(''));
      }

      node.children.forEach(child => setTimeout(recurse(child), 0));

      // Pop last letter off tracker when we're about to move up a level
      tracker.pop();
    }

    recurse(current);

    return suggestions;
  }
}

module.exports = AutoComplete;
