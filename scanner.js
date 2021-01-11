let source = null;
let start = 0;
let current = 0;

function return_iter(value) {
  return { done: false, value };
}

function is_alpha(char) {
  return /[a-zA-Z]/.test(char);
}

function is_numeric(char) {
  return /[0-9]/.test(char);
}

function create_token(type, value) {
  return {
    type,
    value,
  };
}

function peek() {
  return source.charAt(current);
}

function keyword() {
  for (;;) {
    if (!is_alpha(peek())) {
      break;
    }

    advance();
  }

  return create_token("keyword", source.slice(start, current));
}

function number() {
  for (;;) {
    if (!is_numeric(peek())) {
      break;
    }

    advance();
  }

  return create_token("integer", source.slice(start, current));
}

function isAtEnd() {
  return current >= source.length;
}

function advance() {
  current += 1;
  return source.charAt(current - 1);
}

export function tokenize(input) {
  source = input.replace(/\s/g, "");

  return {
    next() {
      start = current;

      if (isAtEnd()) {
        return { done: true, value: null };
      }

      const char = advance();

      if (is_alpha(char)) {
        return return_iter(keyword());
      }

      if (is_numeric(char)) {
        return return_iter(number());
      }

      switch (char) {
        case "(":
          return return_iter(create_token("lb"));
        case ")":
          return return_iter(create_token("rb"));
      }

      return return_iter(char);
    },

    [Symbol.iterator]() {
      return this;
    },
  };
}
