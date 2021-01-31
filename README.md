# Iskra language playground

Link goes here.

## Repository

- `src`: Iskra compiler source
- `site`: Iskra playground website source

## Grammar

```
command := repeat | motion
repeat := 'repeat' INT '(' command ')'
motion := ('turn' | 'forward') INT
```
