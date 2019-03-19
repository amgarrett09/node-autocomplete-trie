# autocomplete-trie

This library uses a prefix trie data structure to efficiently generate
autocomplete suggestions.

## Usage
```
const AutoComplete = require('autocomplete-trie');
const trie = new AutoComplete();
```

## API
### .add( word: String )
Adds a word to the trie. Words inside the trie can be return as suggestions
later.

Example:

```
// Create a new AutoComplete trie
const trie = new AutoComplete();

// Add "hello" to the trie
trie.add('hello');

// AutoComplete trie now contains "hello"
```

### .contains( word: String )
Tests if the AutoComplete trie contains a given word. REturns a boolean.

Example:

```
// Create an empty AutoComplete trie
const trie = new AutoComplete();

// Trie shouldn't contain anything yet. This returns false
let containsHello = trie.contains('hello')

trie.add('hello');

// This returns true now
containsHello = trie.contains('hello')
```

### .suggest( prefix: String )
Takes a word prefix and returns an array of *all* words in the tree which
begin with the prefix.

Rather than searching the whole tree, `.suggest()` will search the subtree
rooted at the last character in the prefix, eliminating most of the nodes
from the search.

Example:

```
// Create empty AutoComplete trie
const trie = new AutoComplete();

// Add some words
trie.add('hello');
trie.add('helium');
trie.add('help');
trie.add('happy');
trie.add('cat');
trie.add('catastrophe');

/* Get suggestions for the prefix 'he'.
The array will look like: ['hello', 'helium', 'help'] */
const suggestions = trie.suggest('he');